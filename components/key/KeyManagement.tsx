import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from "@/components/ui/badge";
import { Copy } from 'lucide-react';
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";
import crypto from 'crypto';
import { uint8ArrayToHex } from './Convert';
import { Textarea } from "@/components/ui/textarea";
import { signAsync, getPublicKeyAsync } from "@noble/ed25519";
import { useKeyStore } from '../hooks/useKeyStore';
import { KeyPair, KeyStatus } from '../types/types';
import { getStatusColor } from '../utils/statusColors';

export const KeyManagement: React.FC = () => {
  const [message, setMessage] = useState<{[keyId: string]: string}>({});
    const [keys, setKeys] = useState<KeyPair[]>([]);
    const { getAllKeys, deleteKey, storeKeys } = useKeyStore();
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
        console.log('Starting key generation process...');
        try {
            setIsGenerating(true);
            console.log('Generating private key...');
            const prvkey = crypto.randomBytes(32);
            console.log('Private key generated:', prvkey);
            const finalPrivKey = uint8ArrayToHex(prvkey);
            console.log('Final private key:', finalPrivKey);
            console.log('Generating public key...');
            const pubKey = await getPublicKeyAsync(finalPrivKey);
            console.log('Public key generated:', pubKey);
            const finalPubKey = uint8ArrayToHex(pubKey);
            console.log('Final public key:', finalPubKey);
            
            console.log('Storing keys...');
            await storeKeys(finalPubKey, finalPrivKey, 'Active');
            console.log('Keys stored successfully.');
            console.log('Fetching keys...');
            await fetchKeys();
            console.log('Keys fetched successfully.');
        } catch (error) {
            console.error('Error generating key:', error);
        } finally {
            setIsGenerating(false);
            console.log('Key generation process completed.');
        }
    };

    const handleMessageChange = (keyId: string | undefined, newMessage: string) => {
      if (keyId === undefined) return;
      setMessage(prev => ({
          ...prev,
          [keyId]: newMessage
      }));
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
                                            <Badge className={getStatusColor(key.status as KeyStatus)}>
                                                {key.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                        <Textarea 
                                            placeholder="Type your message here." 
                                            value={message[key.id?.toString() ?? ''] || ''} 
                                            onChange={(e) => handleMessageChange(key.id?.toString(), e.target.value)} 
                                            className="mb-2"
                                        />
                                        <Button 
                                            onClick={async() => {
                                                const messages = message[key.id?.toString() ?? ''];
                                                if (!message) return;
                                                const signMessage = await signAsync(messages, key.privateKey);
                                                console.log("sign message ", signMessage);
                                            }}
                                            disabled={!message[key.id?.toString() ?? '']}
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
