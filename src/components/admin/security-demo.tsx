import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SecureInput } from '@/components/security/SecureInput';
import { SecureFileUpload } from '@/components/security/SecureFileUpload';
import { useAuth } from '@/contexts/AuthContext';
import { Shield, CheckCircle, AlertTriangle, FileText, User, Lock } from 'lucide-react';

export const SecurityDemo = () => {
  const { user, profile, hasRole } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    email: '',
    filename: ''
  });
  const [formValid, setFormValid] = useState({
    title: false,
    description: false,
    email: false,
    filename: false
  });
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const handleSecureChange = (field: string) => (value: string, isValid: boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setFormValid(prev => ({ ...prev, [field]: isValid }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Secure form submitted:', { formData, uploadedFiles });
  };

  const isFormComplete = Object.values(formValid).every(valid => valid);

  return (
    <div className="space-y-6">
      <Card className="border-accent/30">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-accent" />
            <CardTitle>Security Implementation Status</CardTitle>
          </div>
          <CardDescription>
            Overview of implemented security measures
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Authentication System</span>
                <Badge variant="secondary">Implemented</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Role-Based Access Control</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Input Sanitization</span>
                <Badge variant="secondary">Enabled</Badge>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">File Upload Security</span>
                <Badge variant="secondary">Protected</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Error Boundary</span>
                <Badge variant="secondary">Active</Badge>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-sm">Session Management</span>
                <Badge variant="secondary">Secure</Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <User className="w-5 h-5 text-accent" />
            <CardTitle>Current Session</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p><strong>User:</strong> {profile?.username || user?.email}</p>
            <p><strong>Role:</strong> {profile?.role}</p>
            <p><strong>Admin Access:</strong> {hasRole('admin') ? '✅ Granted' : '❌ Denied'}</p>
            <p><strong>Editor Access:</strong> {hasRole('editor') ? '✅ Granted' : '❌ Denied'}</p>
          </div>
        </CardContent>
      </Card>

      <Tabs defaultValue="input-validation" className="space-y-4">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="input-validation">Input Validation</TabsTrigger>
          <TabsTrigger value="file-security">File Security</TabsTrigger>
        </TabsList>

        <TabsContent value="input-validation" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="w-5 h-5" />
                Secure Form Demo
              </CardTitle>
              <CardDescription>
                This form demonstrates input sanitization and validation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <SecureInput
                  label="Content Title"
                  id="title"
                  placeholder="Enter a title"
                  required
                  minLength={3}
                  maxLength={100}
                  pattern="noSpecialChars"
                  onSecureChange={handleSecureChange('title')}
                />

                <SecureInput
                  label="Description"
                  id="description"
                  placeholder="Enter description"
                  required
                  minLength={10}
                  maxLength={500}
                  onSecureChange={handleSecureChange('description')}
                />

                <SecureInput
                  label="Contact Email"
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  pattern="email"
                  required
                  onSecureChange={handleSecureChange('email')}
                />

                <SecureInput
                  label="Filename"
                  id="filename"
                  placeholder="document.txt"
                  pattern="filename"
                  maxLength={50}
                  onSecureChange={handleSecureChange('filename')}
                />

                <Button 
                  type="submit" 
                  disabled={!isFormComplete}
                  className="w-full"
                >
                  {isFormComplete ? 'Submit Secure Form' : 'Complete All Required Fields'}
                </Button>
              </form>

              <Alert className="mt-4">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Security Features</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>All inputs are sanitized to prevent XSS attacks</li>
                    <li>Real-time validation with custom rules</li>
                    <li>Length limits to prevent buffer overflow</li>
                    <li>Pattern matching for data integrity</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="file-security" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Secure File Upload Demo
              </CardTitle>
              <CardDescription>
                File upload with security validation and restrictions
              </CardDescription>
            </CardHeader>
            <CardContent>
              <SecureFileUpload
                accept=".txt,.pdf,.docx,.json"
                maxSize={5 * 1024 * 1024} // 5MB
                maxFiles={3}
                allowedTypes={[
                  'text/plain',
                  'application/pdf',
                  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
                  'application/json'
                ]}
                onFilesSelected={setUploadedFiles}
              />

              <Alert className="mt-4">
                <Shield className="h-4 w-4" />
                <AlertTitle>File Security Features</AlertTitle>
                <AlertDescription>
                  <ul className="list-disc list-inside mt-2 space-y-1 text-sm">
                    <li>File type validation (MIME type checking)</li>
                    <li>File size limits to prevent DoS attacks</li>
                    <li>Filename sanitization</li>
                    <li>Dangerous extension blocking (.exe, .bat, etc.)</li>
                    <li>Maximum file count restrictions</li>
                  </ul>
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};