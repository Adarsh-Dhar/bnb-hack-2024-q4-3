import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StoreKeys from './StoreKey';
import { MdDelete } from "react-icons/md";
import { FaKey } from "react-icons/fa";
import { IoMdAdd } from "react-icons/io";

interface KeyPair {
    publicKey: string;
    privateKey: string;
    timestamp: number;
}

const DisplayKeys = () => {
  const [keys, setKeys] = useState<KeyPair[]>([]);
  const { getAllKeys } = StoreKeys();

  useEffect(() => {
    const fetchKeys = async () => {
      const fetchedKeys = await getAllKeys();
      setKeys(fetchedKeys);
    };

    fetchKeys();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const truncateKey = (key: any) => {
    if (!key) return '';
    const stringKey = key.toString();
    return `${stringKey.slice(0, 10)}...${stringKey.slice(-10)}`;
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
              className="p-2 hover:bg-gray-100 rounded-full transition-colors flex items-center gap-2 text-gray-600 hover:text-gray-900"
              onClick={() => console.log('Add new key')}
            >
              <IoMdAdd className="w-6 h-6" />
              <span className="text-sm font-medium">Add New Key</span>
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
              </TableRow>
            </TableHeader>
            <TableBody>
              {keys.length > 0 ? (
                keys.map((key, index) => (
                  <TableRow 
                    key={index}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <TableCell className="font-medium text-gray-900">
                      {index + 1}
                    </TableCell>
                    <TableCell className="font-mono text-sm text-gray-600">
                      {truncateKey(key.publicKey)}
                    </TableCell>
                    <TableCell className="flex items-center gap-2 font-mono text-sm text-gray-600">
                      <button 
                        className="p-2 hover:bg-gray-100 rounded-full transition-colors group"
                        onClick={() => console.log('View private key')}
                      >
                        <FaKey className="w-4 h-4 text-gray-400 group-hover:text-gray-600" />
                      </button>
                      <span>Click to view</span>
                    </TableCell>
                    <TableCell>
                      <button 
                        className="p-2 hover:bg-red-50 rounded-full transition-colors group"
                        onClick={() => console.log('Delete key')}
                      >
                        <MdDelete className="text-gray-400 group-hover:text-red-500 w-5 h-5 transition-colors" />
                      </button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell 
                    colSpan={4} 
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