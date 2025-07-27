import { motion } from 'framer-motion';
import { Navigation } from '@/components/Navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Download, Trash2, History as HistoryIcon } from 'lucide-react';

const mockHistoryData = [
  {
    id: 1,
    timestamp: '2024-01-15 14:30:22',
    domain: 'Office',
    temperature: 24.5,
    humidity: 65,
    condition: 'Safe'
  },
  {
    id: 2,
    timestamp: '2024-01-15 13:15:10',
    domain: 'Agriculture',
    temperature: 28.3,
    humidity: 80,
    condition: 'Warning'
  },
  {
    id: 3,
    timestamp: '2024-01-15 12:00:45',
    domain: 'Medical',
    temperature: 22.1,
    humidity: 45,
    condition: 'Safe'
  },
  {
    id: 4,
    timestamp: '2024-01-15 10:45:18',
    domain: 'Factory',
    temperature: 35.7,
    humidity: 90,
    condition: 'Toxic'
  },
  {
    id: 5,
    timestamp: '2024-01-15 09:30:03',
    domain: 'Lab',
    temperature: 20.8,
    humidity: 40,
    condition: 'Safe'
  }
];

export default function History() {
  const getConditionBadge = (condition: string) => {
    switch (condition.toLowerCase()) {
      case 'safe':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/50">{condition}</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/50">{condition}</Badge>;
      case 'toxic':
        return <Badge className="bg-red-500/20 text-red-400 border-red-500/50">{condition}</Badge>;
      default:
        return <Badge className="bg-blue-500/20 text-blue-400 border-blue-500/50">{condition}</Badge>;
    }
  };

  const handleDownloadHistory = () => {
    // Simulate CSV download
    const csvContent = [
      'Timestamp,Domain,Temperature,Humidity,Condition',
      ...mockHistoryData.map(row => 
        `${row.timestamp},${row.domain},${row.temperature},${row.humidity},${row.condition}`
      )
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'envosense-history.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleClearHistory = () => {
    // Simulate clearing history
    console.log('History cleared');
  };

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-24 px-4 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-4">
            Sensor History
          </h1>
          <p className="text-muted-foreground text-lg">
            Review your past environmental readings and predictions
          </p>
        </motion.div>

        {/* Controls */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center mb-8"
        >
          <div className="flex items-center gap-2 text-muted-foreground">
            <HistoryIcon className="h-5 w-5" />
            <span>{mockHistoryData.length} records found</span>
          </div>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={handleDownloadHistory}
              className="glass border-white/20 hover:bg-white/10"
            >
              <Download className="h-4 w-4 mr-2" />
              Download
            </Button>
            <Button 
              variant="outline" 
              onClick={handleClearHistory}
              className="glass border-red-500/30 text-red-400 hover:bg-red-500/10"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Clear History
            </Button>
          </div>
        </motion.div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HistoryIcon className="h-5 w-5" />
                Environmental Readings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 hover:bg-white/5">
                      <TableHead className="text-muted-foreground">Timestamp</TableHead>
                      <TableHead className="text-muted-foreground">Domain</TableHead>
                      <TableHead className="text-muted-foreground">Temperature</TableHead>
                      <TableHead className="text-muted-foreground">Humidity</TableHead>
                      <TableHead className="text-muted-foreground">Condition</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockHistoryData.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="border-white/10 hover:bg-white/5 transition-colors"
                      >
                        <TableCell className="font-mono text-sm">
                          {record.timestamp}
                        </TableCell>
                        <TableCell>
                          <span className="px-2 py-1 rounded-md glass-card text-sm">
                            {record.domain}
                          </span>
                        </TableCell>
                        <TableCell className="text-orange-400 font-medium">
                          {record.temperature}°C
                        </TableCell>
                        <TableCell className="text-blue-400 font-medium">
                          {record.humidity}%
                        </TableCell>
                        <TableCell>
                          {getConditionBadge(record.condition)}
                        </TableCell>
                      </motion.tr>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Empty State (if no data) */}
        {mockHistoryData.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16"
          >
            <HistoryIcon className="h-16 w-16 text-muted-foreground mx-auto mb-4 opacity-50" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">No History Yet</h3>
            <p className="text-muted-foreground">
              Start monitoring your environment to see readings here
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}