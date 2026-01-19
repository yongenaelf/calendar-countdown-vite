import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MobileContainer, IconButton } from '../components';
import { useHolidays } from '../context';
import { parseICSFile, parseCSVFile, type CSVParseResult } from '../services/calendarImport';

interface ListItemProps {
  icon: string;
  iconBg: string;
  iconColor: string;
  title: string;
  subtitle: string;
  onClick?: () => void;
  rightElement?: React.ReactNode;
}

function ListItem({ icon, iconBg, iconColor, title, subtitle, onClick, rightElement }: ListItemProps) {
  return (
    <button 
      onClick={onClick}
      className="w-full text-left flex items-center gap-4 px-5 py-4 justify-between border-b border-gray-50 dark:border-slate-800 last:border-0 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors group"
    >
      <div className="flex items-center gap-4">
        <div className={`flex items-center justify-center rounded-2xl ${iconBg} shrink-0 w-12 h-12`}>
          <span className={`material-symbols-outlined ${iconColor}`}>{icon}</span>
        </div>
        <div className="flex flex-col justify-center">
          <p className="text-base font-semibold leading-normal line-clamp-1 text-slate-800 dark:text-gray-100 group-hover:text-joy-orange transition-colors">{title}</p>
          <p className="text-slate-400 dark:text-gray-500 text-sm font-normal leading-normal line-clamp-1">{subtitle}</p>
        </div>
      </div>
      {rightElement || (
        <span className="material-symbols-outlined text-slate-300 dark:text-gray-600 group-hover:text-joy-orange transition-colors">chevron_right</span>
      )}
    </button>
  );
}

interface ImportResult {
  success: number;
  failed: number;
  errors: string[];
  warnings: string[];
}

export function ImportHolidaysScreen() {
  const navigate = useNavigate();
  const { addHoliday } = useHolidays();
  const icsInputRef = useRef<HTMLInputElement>(null);
  const csvInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importResult, setImportResult] = useState<ImportResult | null>(null);

  const handleICSUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const events = parseICSFile(text);
      
      if (events.length === 0) {
        setImportResult({ 
          success: 0, 
          failed: 0, 
          errors: ['No valid events found in the ICS file'], 
          warnings: [] 
        });
        return;
      }
      
      let success = 0;
      let failed = 0;

      for (const event of events) {
        try {
          addHoliday(event);
          success++;
        } catch {
          failed++;
        }
      }

      setImportResult({ success, failed, errors: [], warnings: [] });
    } catch (error) {
      console.error('Failed to parse ICS file:', error);
      setImportResult({ 
        success: 0, 
        failed: 0, 
        errors: ['Failed to read the ICS file. Please check the file format.'], 
        warnings: [] 
      });
    } finally {
      setImporting(false);
      // Reset input
      if (icsInputRef.current) {
        icsInputRef.current.value = '';
      }
    }
  };

  const handleCSVUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    setImportResult(null);

    try {
      const text = await file.text();
      const result: CSVParseResult = parseCSVFile(text);
      
      // If there are errors, show them and don't import
      if (result.errors.length > 0) {
        setImportResult({ 
          success: 0, 
          failed: 0, 
          errors: result.errors, 
          warnings: result.warnings 
        });
        return;
      }
      
      let success = 0;
      let failed = 0;

      for (const event of result.events) {
        try {
          addHoliday(event);
          success++;
        } catch {
          failed++;
        }
      }

      setImportResult({ success, failed, errors: [], warnings: result.warnings });
    } catch (error) {
      console.error('Failed to parse CSV file:', error);
      setImportResult({ 
        success: 0, 
        failed: 0, 
        errors: ['Failed to read the CSV file. Please check the file format.'], 
        warnings: [] 
      });
    } finally {
      setImporting(false);
      // Reset input
      if (csvInputRef.current) {
        csvInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="bg-sky-50 dark:bg-background-dark min-h-screen">
      <MobileContainer className="bg-sky-50 dark:bg-background-dark">
        {/* Hidden file inputs */}
        <input
          ref={icsInputRef}
          type="file"
          accept=".ics,.ical"
          onChange={handleICSUpload}
          className="hidden"
        />
        <input
          ref={csvInputRef}
          type="file"
          accept=".csv"
          onChange={handleCSVUpload}
          className="hidden"
        />

        {/* Header */}
        <header className="sticky top-0 z-10 bg-sky-50/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-teal-900/5 dark:border-gray-800 transition-colors">
          <div className="flex items-center justify-between px-4 py-3">
            <IconButton 
              icon="arrow_back_ios_new" 
              onClick={() => navigate(-1)}
              className="bg-transparent hover:bg-teal-100/50 dark:hover:bg-gray-800 text-slate-500 dark:text-gray-300"
            />
            <h1 className="text-lg font-bold tracking-tight text-center flex-1 mr-8 text-slate-800 dark:text-white">Import Holidays</h1>
          </div>
        </header>
        
        {/* Main content */}
        <main className="flex-1 w-full max-w-md mx-auto px-4 py-6 space-y-8 overflow-y-auto no-scrollbar">
          {/* Hero */}
          <div className="text-center px-4 mb-2">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-orange-100 dark:bg-orange-900/30 mb-4 text-joy-orange shadow-sm ring-4 ring-white dark:ring-gray-800">
              <span className="material-symbols-outlined text-4xl">celebration</span>
            </div>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">Get the Party Started!</h2>
            <p className="text-sm text-slate-500 dark:text-gray-400 leading-relaxed">Import your holidays to fill up your countdown calendar instantly and let the joy begin.</p>
          </div>

          {/* Import Result Toast */}
          {importResult && (
            <div className={`mx-4 p-4 rounded-2xl ${
              importResult.errors.length > 0 
                ? 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800' 
                : importResult.success > 0 
                  ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800'
                  : 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800'
            }`}>
              <div className="flex items-start gap-3">
                <span className={`material-symbols-outlined mt-0.5 ${
                  importResult.errors.length > 0 
                    ? 'text-red-500' 
                    : importResult.success > 0 
                      ? 'text-green-500'
                      : 'text-yellow-500'
                }`}>
                  {importResult.errors.length > 0 ? 'error' : importResult.success > 0 ? 'check_circle' : 'warning'}
                </span>
                <div className="flex-1 min-w-0">
                  <p className={`font-semibold ${
                    importResult.errors.length > 0 
                      ? 'text-red-700 dark:text-red-300' 
                      : importResult.success > 0 
                        ? 'text-green-700 dark:text-green-300'
                        : 'text-yellow-700 dark:text-yellow-300'
                  }`}>
                    {importResult.errors.length > 0 
                      ? 'Import failed' 
                      : importResult.success > 0 
                        ? `Imported ${importResult.success} event${importResult.success > 1 ? 's' : ''}`
                        : 'No events imported'}
                  </p>
                  
                  {/* Show errors */}
                  {importResult.errors.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {importResult.errors.map((error, i) => (
                        <li key={i} className="text-sm text-red-600 dark:text-red-400">
                          {error}
                        </li>
                      ))}
                    </ul>
                  )}
                  
                  {/* Show warnings */}
                  {importResult.warnings.length > 0 && (
                    <details className="mt-2">
                      <summary className="text-sm text-slate-500 dark:text-gray-400 cursor-pointer hover:text-slate-700 dark:hover:text-gray-300">
                        {importResult.warnings.length} warning{importResult.warnings.length > 1 ? 's' : ''}
                      </summary>
                      <ul className="mt-1 space-y-1 pl-2 border-l-2 border-yellow-300 dark:border-yellow-700">
                        {importResult.warnings.map((warning, i) => (
                          <li key={i} className="text-xs text-slate-500 dark:text-gray-400">
                            {warning}
                          </li>
                        ))}
                      </ul>
                    </details>
                  )}
                  
                  {importResult.failed > 0 && importResult.errors.length === 0 && (
                    <p className="text-sm text-slate-500 dark:text-gray-400 mt-1">
                      {importResult.failed} event{importResult.failed > 1 ? 's' : ''} could not be imported
                    </p>
                  )}
                </div>
                <button 
                  onClick={() => setImportResult(null)}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-full shrink-0"
                >
                  <span className="material-symbols-outlined text-slate-400 text-[20px]">close</span>
                </button>
              </div>
            </div>
          )}
          
          {/* Import Files */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-4">Import Files</h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-teal-900/5 dark:border-gray-800/50">
              <ListItem 
                icon="upload_file"
                iconBg="bg-indigo-50 dark:bg-indigo-500/20"
                iconColor="text-indigo-400"
                title="Upload .ICS File"
                subtitle="Standard iCal format"
                onClick={() => icsInputRef.current?.click()}
                rightElement={importing ? (
                  <span className="material-symbols-outlined text-slate-400 animate-spin">progress_activity</span>
                ) : undefined}
              />
              <ListItem 
                icon="table_view"
                iconBg="bg-teal-50 dark:bg-teal-500/20"
                iconColor="text-teal-400"
                title="Upload .CSV File"
                subtitle="Spreadsheet data"
                onClick={() => csvInputRef.current?.click()}
                rightElement={importing ? (
                  <span className="material-symbols-outlined text-slate-400 animate-spin">progress_activity</span>
                ) : undefined}
              />
            </div>
            <div className="mt-3 ml-4 space-y-1">
              <p className="text-xs text-slate-400 dark:text-gray-500 font-medium flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px] text-indigo-400">info</span>
                Export calendars from your calendar app as .ics files
              </p>
              <a 
                href="/sample-holidays.csv" 
                download="sample-holidays.csv"
                className="text-xs text-sky-500 dark:text-sky-400 font-medium flex items-center gap-1 hover:underline"
              >
                <span className="material-symbols-outlined text-[14px]">download</span>
                Download sample CSV template
              </a>
            </div>
          </div>
          
          {/* Quick Add */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 dark:text-gray-500 uppercase tracking-wider mb-3 ml-4">Quick Add</h3>
            <div className="bg-white dark:bg-surface-dark rounded-3xl overflow-hidden shadow-sm border border-teal-900/5 dark:border-gray-800/50">
              <ListItem 
                icon="public"
                iconBg="bg-yellow-50 dark:bg-yellow-500/20"
                iconColor="text-yellow-500 dark:text-yellow-400"
                title="Holiday Library"
                subtitle="Browse by country"
                onClick={() => navigate('/browse')}
              />
            </div>
          </div>
          
          {/* Privacy note */}
          <div className="flex flex-col items-center justify-center mt-4 px-8 text-center space-y-3 pb-8 opacity-70">
            <span className="material-symbols-outlined text-2xl text-teal-200 dark:text-gray-600">verified_user</span>
            <p className="text-xs text-slate-400 dark:text-gray-500 leading-relaxed max-w-xs mx-auto">
              Your privacy is our top priority. All imports are processed securely directly on your device.
            </p>
          </div>
        </main>
      </MobileContainer>
    </div>
  );
}
