import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Copy } from 'lucide-react';
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import crypto from 'crypto';
import { uint8ArrayToHex, stringToHex } from './Convert';
import { Textarea } from "@/components/ui/textarea";
import { signAsync, getPublicKeyAsync } from "@noble/ed25519";
import { useKeyStore } from '../hooks/useKeyStore';
import { KeyPair, KeyStatus } from '../types/types';
import { Status } from '../utils/status';
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

export const KeyManagement: React.FC = () => {
  const [message, setMessage] = useState<{[keyId: string]: string}>({});
  const [keys, setKeys] = useState<KeyPair[]>([]);
  const { getAllKeys, deleteKey, storeKeys, changeStatus } = useKeyStore();
  const [visiblePrivateKeys, setVisiblePrivateKeys] = useState<{[key: number]: boolean}>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const [copySuccess, setCopySuccess] = useState<{[key: string]: boolean}>({});
  const [alert, setAlert] = useState<{
    show: boolean;
    type: 'error' | 'success';
    message: string;
  }>({ show: false, type: 'error', message: '' });

  const fetchKeys = async () => {
    const fetchedKeys = await getAllKeys();
    setKeys(fetchedKeys);
  };

  useEffect(() => {
    fetchKeys();
  }, []);

  const showAlert = (type: 'error' | 'success', message: string) => {
    setAlert({ show: true, type, message });
    setTimeout(() => {
      setAlert({ show: false, type: 'error', message: '' });
    }, 3000);
  };

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
      const prvkey = crypto.randomBytes(32);
      const finalPrivKey = uint8ArrayToHex(prvkey);
      const pubKey = await getPublicKeyAsync(finalPrivKey);
      const finalPubKey = uint8ArrayToHex(pubKey);
      
      await storeKeys(finalPubKey, finalPrivKey, 'Active');
      await fetchKeys();
    } catch (error) {
      console.error('Error generating key:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleMessageChange = (keyId: string | undefined, newMessage: string) => {
    if (keyId === undefined) return;
    setMessage(prev => ({
      ...prev,
      [keyId]: newMessage
    }));
  };

  const handleStatusChange = async (id: number | undefined, newStatus: KeyStatus) => {
    if (id === undefined) {
      console.error('Cannot update key without ID');
      return;
    }

    try {
      await changeStatus(id, newStatus);
      await fetchKeys();
    } catch (error) {
      console.error('Error updating key status:', error);
    }
  };

  const handleSign = async (key: KeyPair) => {
    if (key.status !== 'Active') {
      showAlert('error', 'Messages can only be signed with Active keys. Please change the key status to Active before signing.');
      return;
    }

    const messages = message[key.id?.toString() ?? ''];
    if (!messages) return;
    
    try {
      const signMessage = await signAsync(stringToHex(messages), key.privateKey);
      console.log("sign message ", signMessage);
      showAlert('success', `Congratulations! Successfully signed the message: "${messages}"`);
    } catch (error) {
      console.error('Error signing message:', error);
      showAlert('error', 'Failed to sign the message. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <Card className="w-full max-w-4xl shadow-lg">
        {alert.show && (
          <Alert 
            variant={alert.type === 'error' ? 'destructive' : 'default'} 
            className={`mb-4 ${alert.type === 'success' ? 'bg-green-50 border-green-200 text-green-800' : ''}`}
          >
            <AlertTitle>{alert.type === 'error' ? 'Error' : 'Success'}</AlertTitle>
            <AlertDescription>{alert.message}</AlertDescription>
          </Alert>
        )}
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
                      <Status 
                        currentStatus={key.status as KeyStatus}
                        
                        onStatusChange={(newStatus: KeyStatus) => handleStatusChange(key.id, newStatus)}
                      />
                    </TableCell>
                    <TableCell>
                      <Textarea 
                        placeholder="Type your message here." 
                        value={message[key.id?.toString() ?? ''] || ''} 
                        onChange={(e) => handleMessageChange(key.id?.toString(), e.target.value)} 
                        className="mb-2"
                      />
                      <Button 
                        onClick={() => handleSign(key)}
                        disabled={!message[key.id?.toString() ?? '']}
                        className={key.status !== 'Active' ? 'opacity-50' : ''}
                      >
                        Sign
                      </Button>
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