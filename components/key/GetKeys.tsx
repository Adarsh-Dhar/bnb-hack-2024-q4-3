import React, { useState, useEffect } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import StoreKeys from './StoreKey';
import { MdDelete } from "react-icons/md";

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
  const truncateKey = (key : any) => {
    if (!key) return '';
    const stringKey = key.toString();
    return `${stringKey.slice(0, 10)}...${stringKey.slice(-10)}`;
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>Stored Keys</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Public Key</TableHead>
              <TableHead>Private Key</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length > 0 ? (
              keys.map((key, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{index + 1}</TableCell>
                  <TableCell className="font-mono text-sm">
                    {truncateKey(key.publicKey)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                    {truncateKey(key.privateKey)}
                  </TableCell>
                  <TableCell className="font-mono text-sm">
                  <MdDelete />
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={3} className="text-center">
                  No keys found
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default DisplayKeys;