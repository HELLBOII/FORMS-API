import RowsForm from '@/components/RowsForm';
import { Toaster } from '@/components/ui/sonner';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="container mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">
            MySQL Data Manager
          </h1>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Add, edit, and save form rows to your MySQL database. 
            All changes are synchronized with your external database.
          </p>
        </div>
        
        <RowsForm />
      </div>
      <Toaster />
    </div>
  );
}