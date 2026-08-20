"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Search, RefreshCw } from "lucide-react"
import api from "@/lib/api"

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState("")

  const loadLogs = async () => {
    try {
      setLoading(true)
      const res = await api.get('/admin/audit-logs')
      if (res.data && res.data.success) {
        setLogs(res.data.data)
      }
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadLogs()
  }, [])

  const filteredLogs = logs.filter(l => 
    l.action.toLowerCase().includes(search.toLowerCase()) || 
    l.admin.toLowerCase().includes(search.toLowerCase()) ||
    l.target.toLowerCase().includes(search.toLowerCase())
  )

  const getActionBadge = (action: string) => {
    if (action.includes("DELETE") || action.includes("BANNED")) return <Badge variant="destructive">{action}</Badge>
    if (action.includes("UPDATE") || action.includes("RESTOCK")) return <Badge variant="default">{action}</Badge>
    if (action.includes("CREATE") || action.includes("APPROVE")) return <Badge variant="success">{action}</Badge>
    return <Badge variant="secondary">{action}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Security & Audit Logs</h1>
          <p className="text-sm text-muted-foreground">Real-time immutable audit trail recorded in database</p>
        </div>
        <Button variant="outline" size="sm" onClick={loadLogs}>
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
        </Button>
      </div>

      <div className="flex items-center gap-2 max-w-sm">
        <div className="relative w-full">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search audit actions, admins..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Log ID</TableHead>
              <TableHead>Action</TableHead>
              <TableHead>Administrator</TableHead>
              <TableHead>Target Resource</TableHead>
              <TableHead>Change Details</TableHead>
              <TableHead>IP Address</TableHead>
              <TableHead className="text-right">Timestamp</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">Loading audit records from database...</TableCell>
              </TableRow>
            ) : filteredLogs.map((log) => (
              <TableRow key={log.id}>
                <TableCell className="font-mono text-xs font-semibold">{log.id}</TableCell>
                <TableCell>{getActionBadge(log.action)}</TableCell>
                <TableCell className="text-xs font-medium">{log.admin}</TableCell>
                <TableCell className="text-xs font-semibold">{log.target}</TableCell>
                <TableCell className="text-xs text-muted-foreground max-w-xs truncate">{log.details}</TableCell>
                <TableCell className="font-mono text-xs text-muted-foreground">{log.ip}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">{log.timestamp}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}