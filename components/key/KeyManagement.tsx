import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '../ui/button';
import { Copy } from 'lucide-react';
import StoreKeys from './StoreKey';
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { buildEddsa } from "circomlibjs";
import crypto from 'crypto';
import { uint8ArrayToHex } from './Convert';
import { signMessage } from './Sign';

interface KeyPair {
    id?: number;
    publicKey: string;
    privateKey: string;
    timestamp: number;
}

const DisplayKeys = () => {
  const [keys, setKeys] = useState<KeyPair[]>([]);
  const { getAllKeys, deleteKey, storeKeys } = StoreKeys();
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{[key: number]: boolean}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});

  const fetchKeys = async () => {
    const fetchedKeys = await getAllKeys();
    setKeys(fetchedKeys);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const truncateKey = (key: any) => {
    if (!key) return '';
    const stringKey = key.toString();
    return `${stringKey.slice(0, 10)}...${stringKey.slice(-10)}`;
  };

  const handleCopy = async (text: string, keyId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopySuccess({ [keyId]: true });
      setTimeout(() => {
        setCopySuccess({ [keyId]: false });
      }, 2000);
    } catch (err) {
      console.error('Failed to copy text:', err);
    }
  };

  const togglePrivateKey = (index: number) => {
    setVisiblePrivateKeys(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  const handleDelete = async (id: number | undefined) => {
    if (id === undefined) {
      console.error('Cannot delete key without ID');
      return;
    }
    
    try {
      await deleteKey(id);
      await fetchKeys();
    } catch (error) {
      console.error('Error deleting key:', error);
    }
  };

  const handleAddKey = async () => {
    try {
      setIsGenerating(true);
      const eddsa = await buildEddsa();
      const prvkey = crypto.randomBytes(32);
      const pubkey = eddsa.prv2pub(prvkey);
      const finalPubKey = uint8ArrayToHex(Buffer.concat([pubkey[0], pubkey[1]]));
      const finalPrivKey = uint8ArrayToHex(prvkey);
      
      await storeKeys(finalPubKey, finalPrivKey);
      await fetchKeys();
    } catch (error) {
      console.error('Error generating key:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        <CardHeader className="bg-white rounded-t-lg border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CardTitle className="text-2xl font-semibold text-gray-800">
                Stored Keys
              </CardTitle>
              <FaKey className="text-gray-600 w-5 h-5" />
            </div>
            <button 
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleAddKey}
              disabled={isGenerating}
            >
              <IoMdAdd className="w-6 h-6" />
              <span className="text-sm font-medium">
                {isGenerating ? 'Generating...' : 'Add New Key'}
              </span>
            </button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-gray-700">ID</TableHead>
                <TableHead className="text-gray-700">Public Key</TableHead>
                <TableHead className="text-gray-700">Private Key</TableHead>
                <TableHead className="w-20 text-gray-700">Actions</TableHead>
                <TableHead className="w-20 text-gray-700">Sign</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length > 0 ? (
                keys.map((key, index) => (
                  <TableRow 
                    key={key.id || index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {key.id}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <span>{truncateKey(key.publicKey)}</span>
                        <button
                          onClick={() => handleCopy(key.publicKey, `pub-${key.id}`)}
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                        >
                          <Copy className={`w-4 h-4 ${copySuccess[`pub-${key.id}`] ? 'text-green-500' : 'text-gray-400'}`} />
                        </button>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button 
                            className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                            onClick={() => togglePrivateKey(index)}
                          >
                            <FaKey className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                          </button>
                          {visiblePrivateKeys[index] ? 
                            truncateKey(key.privateKey) : 
                            <span>Click to view</span>
                          }
                        </div>
                        {visiblePrivateKeys[index] && (
                          <button
                            onClick={() => handleCopy(key.privateKey, `priv-${key.id}`)}
                            className="p-1 hover:bg-gray-100 rounded transition-colors"
                          >
                            <Copy className={`w-4 h-4 ${copySuccess[`priv-${key.id}`] ? 'text-green-500' : 'text-gray-400'}`} />
                          </button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button onClick={() => {
                        try {
                          signMessage("comon you gunners", key.privateKey);
                        } catch(error) {
                          console.error(error);
                        }
                      }}>Sign Message</Button>
                    </TableCell>
                    <TableCell>
                      <button 
                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                        onClick={() => handleDelete(key.id)}
                      >
                        <MdDelete className="text-gray-400 group-hover:text-red-500 w-5 h-5 transition-colors" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={5}
                    className="text-center py-8 text-gray-500"
                  >
                    No keys found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default DisplayKeys;