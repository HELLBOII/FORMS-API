'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Trash2, Plus, Save, Loader2 } from 'lucide-react';
import { saveRows } from '@/lib/api';
import { toast } from 'sonner';

interface FormRow {
  id: string;
  name: string;
  amount: number;
}

export default function RowsForm() {
  const [rows, setRows] = useState<FormRow[]>([
    { id: '1', name: '', amount: 0 }
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const addRow = () => {
    const newRow: FormRow = {
      id: Date.now().toString(),
      name: '',
      amount: 0
    };
    setRows([...rows, newRow]);
  };

  const removeRow = (id: string) => {
    if (rows.length > 1) {
      setRows(rows.filter(row => row.id !== id));
    }
  };

  const updateRow = (id: string, field: keyof Omit<FormRow, 'id'>, value: string | number) => {
    setRows(rows.map(row => 
      row.id === id ? { ...row, [field]: value } : row
    ));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate rows
    const validRows = rows.filter(row => row.name.trim() !== '');
    if (validRows.length === 0) {
      toast.error('Please add at least one row with a name');
      return;
    }

    setIsLoading(true);
    
    try {
      // Convert to the format expected by the API
      const apiRows = validRows.map(({ name, amount }) => ({ name, amount }));
      
      const result = await saveRows(apiRows);
      
      if (result.success) {
        toast.success('Rows saved successfully!');
      } else {
        toast.error('Failed to save rows');
      }
    } catch (error) {
      console.error('Error saving rows:', error);
      toast.error('Failed to save rows. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const totalAmount = rows.reduce((sum, row) => sum + (row.amount || 0), 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Save className="h-5 w-5" />
          Form Rows Manager
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            {rows.map((row, index) => (
              <div key={row.id} className="flex items-center gap-3 p-3 border rounded-lg">
                <div className="flex-1">
                  <Label htmlFor={`name-${row.id}`} className="text-sm">
                    Name
                  </Label>
                  <Input
                    id={`name-${row.id}`}
                    type="text"
                    placeholder="Enter name"
                    value={row.name}
                    onChange={(e) => updateRow(row.id, 'name', e.target.value)}
                    className="mt-1"
                  />
                </div>
                <div className="flex-1">
                  <Label htmlFor={`amount-${row.id}`} className="text-sm">
                    Amount
                  </Label>
                  <Input
                    id={`amount-${row.id}`}
                    type="number"
                    placeholder="0"
                    value={row.amount || ''}
                    onChange={(e) => updateRow(row.id, 'amount', parseFloat(e.target.value) || 0)}
                    className="mt-1"
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => removeRow(row.id)}
                  disabled={rows.length === 1}
                  className="mt-6"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <div className="text-sm text-muted-foreground">
              Total Amount: <span className="font-semibold">${totalAmount.toFixed(2)}</span>
            </div>
            <div className="flex gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={addRow}
                className="flex items-center gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Row
              </Button>
              <Button 
                type="submit" 
                disabled={isLoading}
                className="flex items-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Save className="h-4 w-4" />
                )}
                Save Rows
              </Button>
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}