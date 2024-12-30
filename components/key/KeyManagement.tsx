import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Copy } from 'lucide-react';
import StoreKeys from './StoreKey';
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import { buildEddsa } from "circomlibjs";
import crypto from 'crypto';
import { uint8ArrayToHex } from './Convert';
import { Textarea } from "@/components/ui/textarea"
import { signAsync } from "@noble/ed25519"

type KeyStatus = 'Active' | 'Revoked' | 'Expired' | 'Compromised' | 'Archived' | 'Not Initialized';

interface KeyPair {
    id?: number;
    publicKey: string;
    privateKey: string;
    timestamp: number;
    status: KeyStatus;
}

const getStatusColor = (status: KeyStatus) => {
  const colors = {
    'Active': 'bg-green-100 text-green-800',
    'Revoked': 'bg-red-100 text-red-800',
    'Expired': 'bg-yellow-100 text-yellow-800',
    'Compromised': 'bg-red-100 text-red-800',
    'Archived': 'bg-gray-100 text-gray-800',
    'Not Initialized': 'bg-blue-100 text-blue-800'
  };
  return colors[status] || '';
};

const DisplayKeys = () => {
  const [message, setMessage] = useState("")
  const [keys, setKeys] = useState<KeyPair[]>([]);
  const { getAllKeys, deleteKey, storeKeys } = StoreKeys();
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{[key: number]: boolean}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});

  const fetchKeys = async () => {
    const fetchedKeys = await getAllKeys();
    setKeys(fetchedKeys as KeyPair[]);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const truncateKey = (key: string) => {
    if (!key) return '';
    return `${key.slice(0, 10)}...${key.slice(-10)}`;
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
      
      await storeKeys(finalPubKey, finalPrivKey, 'Active');
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
            <Button
              onClick={handleAddKey}
              disabled={isGenerating}
              className="flex items-center gap-2"
            >
              <IoMdAdd className="w-5 h-5" />
              {isGenerating ? 'Generating...' : 'Add New Key'}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-20 text-gray-700">ID</TableHead>
                <TableHead className="text-gray-700">Public Key</TableHead>
                <TableHead className="text-gray-700">Private Key</TableHead>
                <TableHead className="text-gray-700">Status</TableHead>
                <TableHead className="w-[200px] text-gray-700">Sign</TableHead>
                <TableHead className="w-20 text-gray-700">Actions</TableHead>
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
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCopy(key.publicKey, `pub-${key.id}`)}
                        >
                          <Copy className={`w-4 h-4 ${copySuccess[`pub-${key.id}`] ? 'text-green-500' : 'text-gray-400'}`} />
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => togglePrivateKey(index)}
                          >
                            <FaKey className="w-4 h-4" />
                          </Button>
                          {visiblePrivateKeys[index] ? 
                            truncateKey(key.privateKey) : 
                            <span>Click to view</span>
                          }
                        </div>
                        {visiblePrivateKeys[index] && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleCopy(key.privateKey, `priv-${key.id}`)}
                          >
                            <Copy className={`w-4 h-4 ${copySuccess[`priv-${key.id}`] ? 'text-green-500' : 'text-gray-400'}`} />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getStatusColor(key.status)}>
                        {key.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                    <Textarea placeholder="Type your message here." value={message} onChange={(e) => setMessage(e.target.value)} />
        <Button onClick={async() => {
            const signMessage = await signAsync(message, key.privateKey)
            console.log("sign message ", signMessage)
        }}>Sign</Button>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDelete(key.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <MdDelete className="w-5 h-5" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={6}
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