
// import Link from "next/link";
// import dbConnect from "@/lib/mongodb";
// import InsuranceRequest from "@/models/InsuranceRequest";
// import { getCurrentUser } from "@/lib/session";
// import { 
//   Card, CardContent, CardHeader, CardTitle, CardDescription 
// } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { 
//   FileText, Clock, CheckCircle2, AlertCircle, Plus, FileSearch 
// } from "lucide-react";
// import { Badge } from "@/components/ui/badge";

// // Ensure real-time data
// export const dynamic = "force-dynamic";

// async function getDashboardStats(userId: string) {
//   await dbConnect();
  
//   // We need to find the InsurerProfile ID first, but usually we link requests to User or Profile.
//   // In the model I gave you earlier: insurerId refers to the Profile.
//   // Let's assume we query by populating or we fetch profile first.
//   // Ideally: const profile = await InsurerProfile.findOne({ userId });
//   // For speed/simplicity in this demo, let's assume we fetch requests by populating the insurerId 
//   // and matching the userId, OR we update the model to also store userId directly.
  
//   // Correction: To make it robust, let's look up the profile ID.
//   const InsurerProfile = (await import("@/models/InsurerProfile")).default;
//   const profile = await InsurerProfile.findOne({ userId });
  
//   if (!profile) return { stats: { pending: 0, quoted: 0, completed: 0 }, recent: [] };

//   const requests = await InsuranceRequest.find({ insurerId: profile._id })
//     .sort({ createdAt: -1 })
//     .limit(5)
//     .lean();

//   const counts = await InsuranceRequest.aggregate([
//     { $match: { insurerId: profile._id } },
//     { $group: { _id: "$status", count: { $sum: 1 } } }
//   ]);

//   const stats = {
//     pending: counts.find(c => c._id === 'Submitted' || c._id === 'Under Review')?.count || 0,
//     quoted: counts.find(c => c._id === 'Quoted')?.count || 0,
//     completed: counts.find(c => c._id === 'Accepted')?.count || 0
//   };

//   return { stats, recent: JSON.parse(JSON.stringify(requests)) };
// }

// const getStatusColor = (status: string) => {
//   switch (status) {
//     case 'Submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
//     case 'Quoted': return 'bg-blue-100 text-blue-800 border-blue-200 font-bold';
//     case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
//     case 'Declined': return 'bg-red-100 text-red-800 border-red-200';
//     default: return 'bg-gray-100 text-gray-800';
//   }
// };

// export default async function InsurerDashboard() {
//   const user = await getCurrentUser();
//   const { stats, recent } = await getDashboardStats(user.id);

//   return (
//     <div className="space-y-8">
      
//       {/* Header & CTA */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <div>
//           <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
//           <p className="text-slate-500">Welcome back, {user.name}. Here is your claims overview.</p>
//         </div>
//         <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800 shadow-md">
//           <Link href="/insurer/requests/new">
//             <Plus className="mr-2 h-5 w-5" /> New Proforma Request
//           </Link>
//         </Button>
//       </div>

//       {/* Stats Grid */}
//       <div className="grid gap-4 md:grid-cols-3">
//         <Card className="border-t-4 border-t-yellow-500 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
//             <Clock className="h-4 w-4 text-yellow-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.pending}</div>
//             <p className="text-xs text-muted-foreground">Awaiting merchant response</p>
//           </CardContent>
//         </Card>
        
//         <Card className="border-t-4 border-t-blue-600 shadow-sm bg-blue-50/50">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-blue-900">Ready for Decision</CardTitle>
//             <FileSearch className="h-4 w-4 text-blue-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold text-blue-900">{stats.quoted}</div>
//             <p className="text-xs text-blue-700">Quotations received</p>
//           </CardContent>
//         </Card>

//         <Card className="border-t-4 border-t-green-600 shadow-sm">
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium text-muted-foreground">Settled Claims</CardTitle>
//             <CheckCircle2 className="h-4 w-4 text-green-600" />
//           </CardHeader>
//           <CardContent>
//             <div className="text-2xl font-bold">{stats.completed}</div>
//             <p className="text-xs text-muted-foreground">Approved & verified</p>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Recent Requests Table */}
//       <Card className="shadow-sm border">
//         <CardHeader>
//           <CardTitle>Recent Activity</CardTitle>
//           <CardDescription>Latest proforma requests and their status.</CardDescription>
//         </CardHeader>
//         <CardContent>
//           {recent.length === 0 ? (
//             <div className="text-center py-12">
//               <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
//                 <FileText className="h-6 w-6 text-slate-400" />
//               </div>
//               <h3 className="text-sm font-medium text-slate-900">No requests found</h3>
//               <p className="text-xs text-slate-500 mt-1">Start by creating your first claim request.</p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
//               {recent.map((req: any) => (
//                 <div key={req._id} className="flex items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors">
//                   <div className="flex items-start gap-4">
//                     <div className="bg-blue-100 p-2 rounded text-blue-700 mt-1">
//                       <FileText className="h-5 w-5" />
//                     </div>
//                     <div>
//                       <div className="flex items-center gap-2">
//                         <span className="font-semibold text-slate-900">Claim #{req.claimReferenceNumber}</span>
//                         <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
//                       </div>
//                       <p className="text-sm text-slate-600 mt-0.5">
//                         {req.vehicleDetails.year} {req.vehicleDetails.make} {req.vehicleDetails.model}
//                       </p>
//                       <p className="text-xs text-slate-400 mt-1">
//                         Submitted: {new Date(req.createdAt).toLocaleDateString()}
//                       </p>
//                     </div>
//                   </div>
                  
//                   <Button asChild variant="outline" size="sm">
//                     <Link href={`/insurer/requests/${req._id}`}>View Details</Link>
//                   </Button>
//                 </div>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   );
// }


import Link from "next/link";
import dbConnect from "@/lib/mongodb";
import InsuranceRequest from "@/models/InsuranceRequest";
import { getCurrentUser } from "@/lib/session";
import { 
  Card, CardContent, CardHeader, CardTitle, CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  FileText, Clock, CheckCircle2, Plus, FileSearch 
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const dynamic = "force-dynamic";

async function getDashboardStats(userId: string) {
  await dbConnect();
  
  const InsurerProfile = (await import("@/models/InsurerProfile")).default;
  const profile = await InsurerProfile.findOne({ userId });
  
  if (!profile) return { stats: { pending: 0, quoted: 0, completed: 0 }, recent: [] };

  const requests = await InsuranceRequest.find({ insurerId: profile._id })
    .sort({ createdAt: -1 })
    .limit(5)
    .lean();

  const counts = await InsuranceRequest.aggregate([
    { $match: { insurerId: profile._id } },
    { $group: { _id: "$status", count: { $sum: 1 } } }
  ]);

  const stats = {
    pending: counts.find(c => c._id === 'Submitted' || c._id === 'Under Review')?.count || 0,
    quoted: counts.find(c => c._id === 'Quoted')?.count || 0,
    completed: counts.find(c => c._id === 'Accepted')?.count || 0
  };

  return { stats, recent: JSON.parse(JSON.stringify(requests)) };
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Submitted': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    case 'Quoted': return 'bg-blue-100 text-blue-800 border-blue-200 font-bold';
    case 'Accepted': return 'bg-green-100 text-green-800 border-green-200';
    case 'Declined': return 'bg-red-100 text-red-800 border-red-200';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export default async function InsurerDashboard() {
  const user = await getCurrentUser();
  const { stats, recent } = await getDashboardStats(user.id);

  return (
    <div className="space-y-8">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Dashboard</h1>
          <p className="text-slate-500">Welcome back, {user.name}. Here is your claims overview.</p>
        </div>
        <Button asChild size="lg" className="bg-blue-900 hover:bg-blue-800 shadow-md w-full sm:w-auto">
          <Link href="/insurer/requests/new">
            <Plus className="mr-2 h-5 w-5" /> New Proforma Request
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="border-t-4 border-t-yellow-500 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pending}</div>
            <p className="text-xs text-muted-foreground">Awaiting merchant response</p>
          </CardContent>
        </Card>
        
        <Card className="border-t-4 border-t-blue-600 shadow-sm bg-blue-50/50">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-blue-900">Ready for Decision</CardTitle>
            <FileSearch className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900">{stats.quoted}</div>
            <p className="text-xs text-blue-700">Quotations received</p>
          </CardContent>
        </Card>

        <Card className="border-t-4 border-t-green-600 shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Settled Claims</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completed}</div>
            <p className="text-xs text-muted-foreground">Approved & verified</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-sm border">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest proforma requests and their status.</CardDescription>
        </CardHeader>
        <CardContent>
          {recent.length === 0 ? (
            <div className="text-center py-12">
              <div className="bg-slate-100 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3">
                <FileText className="h-6 w-6 text-slate-400" />
              </div>
              <h3 className="text-sm font-medium text-slate-900">No requests found</h3>
              <p className="text-xs text-slate-500 mt-1">Start by creating your first claim request.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
              {recent.map((req: any) => (
                // FIX: Flex-col on mobile makes the button drop below the text
                <div key={req._id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg bg-white hover:bg-slate-50 transition-colors gap-4">
                  <div className="flex items-start gap-4">
                    <div className="bg-blue-100 p-2 rounded text-blue-700 mt-1 shrink-0">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-slate-900">Claim #{req.claimReferenceNumber}</span>
                        <Badge variant="outline" className={getStatusColor(req.status)}>{req.status}</Badge>
                      </div>
                      <p className="text-sm text-slate-600 mt-0.5">
                        {req.vehicleDetails.year} {req.vehicleDetails.make} {req.vehicleDetails.model}
                      </p>
                      <p className="text-xs text-slate-400 mt-1">
                        Submitted: {new Date(req.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  
                  {/* FIX: Full width button on mobile */}
                  <Button asChild variant="outline" size="sm" className="w-full sm:w-auto">
                    <Link href={`/insurer/requests/${req._id}`}>View Details</Link>
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}