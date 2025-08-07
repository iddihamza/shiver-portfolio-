import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Server, Database, HardDrive, Cpu, Wifi, 
  CheckCircle, AlertTriangle, XCircle, RefreshCw,
  Activity, Clock, Shield, Zap
} from "lucide-react";

export const SystemHealth = () => {
  // Mock system health data (in a real app, this would come from actual monitoring)
  const systemMetrics = {
    uptime: "99.9%",
    responseTime: "142ms",
    totalRequests: "847K",
    errorRate: "0.01%",
    lastBackup: "2 hours ago",
    dataIntegrity: "100%"
  };

  const healthChecks = [
    {
      name: "Database Connection",
      status: "healthy",
      description: "All database connections are stable",
      icon: Database,
      lastCheck: "30s ago"
    },
    {
      name: "API Endpoints",
      status: "healthy", 
      description: "All API endpoints responding normally",
      icon: Server,
      lastCheck: "1m ago"
    },
    {
      name: "File Storage",
      status: "healthy",
      description: "Storage systems operational",
      icon: HardDrive,
      lastCheck: "45s ago"
    },
    {
      name: "Search Index",
      status: "warning",
      description: "Search indexing is 2 hours behind",
      icon: Activity,
      lastCheck: "2m ago"
    },
    {
      name: "Content Delivery",
      status: "healthy",
      description: "CDN performance is optimal",
      icon: Zap,
      lastCheck: "1m ago"
    },
    {
      name: "Security Monitoring",
      status: "healthy",
      description: "No security threats detected",
      icon: Shield,
      lastCheck: "30s ago"
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'text-green-500';
      case 'warning':
        return 'text-yellow-500';
      case 'error':
        return 'text-red-500';
      default:
        return 'text-muted-foreground';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Activity className="w-4 h-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'healthy':
        return <Badge className="bg-green-500/10 text-green-500 border-green-500/20">Healthy</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500/10 text-yellow-500 border-yellow-500/20">Warning</Badge>;
      case 'error':
        return <Badge className="bg-red-500/10 text-red-500 border-red-500/20">Error</Badge>;
      default:
        return <Badge variant="secondary">Unknown</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* System Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Uptime</CardTitle>
            <Server className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{systemMetrics.uptime}</div>
            <p className="text-xs text-muted-foreground">Last 30 days</p>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Response Time</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.responseTime}</div>
            <p className="text-xs text-muted-foreground">Average response time</p>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Error Rate</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{systemMetrics.errorRate}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Requests</CardTitle>
            <Cpu className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.totalRequests}</div>
            <p className="text-xs text-muted-foreground">Requests served</p>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Backup</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{systemMetrics.lastBackup}</div>
            <p className="text-xs text-muted-foreground">Automatic backup</p>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Integrity</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">{systemMetrics.dataIntegrity}</div>
            <p className="text-xs text-muted-foreground">Integrity checks passed</p>
          </CardContent>
        </Card>
      </div>

      {/* Health Checks */}
      <Card className="tech-card-glow bg-card/60">
        <CardHeader className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            System Health Checks
          </CardTitle>
          <Button variant="outline" size="sm">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh All
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {healthChecks.map((check, index) => (
              <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <check.icon className={`w-5 h-5 ${getStatusColor(check.status)}`} />
                  <div>
                    <div className="font-medium">{check.name}</div>
                    <div className="text-sm text-muted-foreground">{check.description}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">Last check: {check.lastCheck}</div>
                  </div>
                  {getStatusBadge(check.status)}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="tech-card-glow bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Cpu className="w-5 h-5" />
              Resource Usage
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>CPU Usage</span>
                <span>23%</span>
              </div>
              <Progress value={23} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Memory Usage</span>
                <span>45%</span>
              </div>
              <Progress value={45} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Storage Usage</span>
                <span>67%</span>
              </div>
              <Progress value={67} className="h-2" />
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Network I/O</span>
                <span>12%</span>
              </div>
              <Progress value={12} className="h-2" />
            </div>
          </CardContent>
        </Card>

        <Card className="tech-card-glow bg-card/60">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Wifi className="w-5 h-5" />
              Network Status
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">99.8%</div>
                <div className="text-xs text-muted-foreground">Network Uptime</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold">47ms</div>
                <div className="text-xs text-muted-foreground">Avg Latency</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-sm">CDN Status</span>
                <Badge className="bg-green-500/10 text-green-500">Operational</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">API Gateway</span>
                <Badge className="bg-green-500/10 text-green-500">Healthy</Badge>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Load Balancer</span>
                <Badge className="bg-green-500/10 text-green-500">Active</Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};