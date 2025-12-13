// // src/app/profile/page.tsx
// /* eslint-disable @typescript-eslint/no-explicit-any */


// import { redirect } from "next/navigation";
// import Image from "next/image";
// import Link from "next/link";
// import dbConnect from "@/lib/mongodb";
// import Order from "@/models/Order";
// import { getCurrentUser } from "@/lib/session";
// import { 
//   Card, 
//   CardContent, 
//   CardHeader, 
//   CardTitle, 
//   CardDescription 
// } from "@/components/ui/card";
// import { Badge } from "@/components/ui/badge";
// import { Button } from "@/components/ui/button";
// import { 
//   Package, 
//   MapPin, 
//   Calendar, 
//   CreditCard, 
//   User as UserIcon,
//   ChevronRight 
// } from "lucide-react";
// import { Separator } from "@/components/ui/separator";

// // Helper to get status color
// const getStatusColor = (status: string) => {
//   switch (status) {
//     case "Pending Verification": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
//     case "Processing": return "bg-blue-100 text-blue-800 hover:bg-blue-100";
//     case "On Route": return "bg-purple-100 text-purple-800 hover:bg-purple-100";
//     case "Delivered": return "bg-green-100 text-green-800 hover:bg-green-100";
//     case "Cancelled": return "bg-red-100 text-red-800 hover:bg-red-100";
//     default: return "bg-gray-100 text-gray-800";
//   }
// };

// async function getUserOrders(userId: string) {
//   await dbConnect();
//   // Fetch orders, sort by newest first
//   const orders = await Order.find({ userId })
//     .sort({ createdAt: -1 })
//     .lean();
  
//   return JSON.parse(JSON.stringify(orders));
// }

// export default async function ProfilePage() {
//   const user = await getCurrentUser();

//   if (!user) {
//     redirect("/login");
//   }

//   const orders = await getUserOrders(user.id);

//   return (
//     <div className="container py-8 md:py-12">
//       <h1 className="text-3xl font-bold mb-8">My Account</h1>

//       <div className="grid lg:grid-cols-4 gap-8">
        
//         {/* SIDEBAR: User Info */}
//         <aside className="lg:col-span-1 space-y-6">
//           <Card>
//             <CardHeader className="text-center">
//               <div className="mx-auto bg-primary/10 w-20 h-20 rounded-full flex items-center justify-center mb-2">
//                 <span className="text-2xl font-bold text-primary">
//                   {user.name?.charAt(0).toUpperCase()}
//                 </span>
//               </div>
//               <CardTitle>{user.name}</CardTitle>
//               <CardDescription>{user.email}</CardDescription>
//             </CardHeader>
//             <CardContent className="space-y-4">
//               <div className="flex items-center gap-2 text-sm text-muted-foreground">
//                 <UserIcon className="h-4 w-4" />
//                 <span>Customer ID: {user.id.substring(0, 8)}...</span>
//               </div>
//               <Separator />
//               <Button asChild variant="outline" className="w-full justify-start">
//                 <Link href="/cart">Go to Cart</Link>
//               </Button>
//               {user.role === 'admin' && (
//                  <Button asChild className="w-full justify-start">
//                    <Link href="/admin">Admin Dashboard</Link>
//                  </Button>
//               )}
//             </CardContent>
//           </Card>
//         </aside>

//         {/* MAIN: Order History */}
//         <div className="lg:col-span-3">
//           <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
//             <Package className="h-5 w-5" /> Order History
//           </h2>

//           {orders.length === 0 ? (
//             <Card className="text-center py-12">
//               <CardContent>
//                 <p className="text-muted-foreground mb-4">You haven not placed any orders yet.</p>
//                 <Button asChild>
//                   <Link href="/products">Start Shopping</Link>
//                 </Button>
//               </CardContent>
//             </Card>
//           ) : (
//             <div className="space-y-6">
//               {orders.map((order: any) => (
//                 <Card key={order._id} className="overflow-hidden">
//                   {/* Order Header */}
//                   <div className="bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b">
//                     <div className="space-y-1">
//                       <p className="text-sm font-medium">
//                         Order <span className="font-mono text-muted-foreground">#{order.transactionReference?.substring(0,8) || order._id.substring(0,8)}</span>
//                       </p>
//                       <div className="flex items-center gap-2 text-xs text-muted-foreground">
//                         <Calendar className="h-3 w-3" />
//                         {new Date(order.createdAt).toLocaleDateString("en-US", { 
//                           year: 'numeric', month: 'long', day: 'numeric' 
//                         })}
//                       </div>
//                     </div>
//                     <div className="flex flex-col sm:items-end gap-1">
//                       <Badge className={getStatusColor(order.status)}>
//                         {order.status}
//                       </Badge>
//                       <p className="text-sm font-bold">ETB {order.totalAmount.toLocaleString()}</p>
//                     </div>
//                   </div>

//                   <CardContent className="p-4 sm:p-6">
//                     {/* Items Grid */}
//                     <div className="space-y-4">
//                       {order.items.map((item: any, idx: number) => (
//                         <div key={idx} className="flex items-start gap-4">
//                           {/* We don't save item images in Order Snapshot currently, 
//                               so we use a placeholder or would need to populate from Product model.
//                               For simplicity/speed, we use a generic placeholder icon here. */}
//                           <div className="h-16 w-16 bg-muted rounded flex items-center justify-center shrink-0">
//                              <Package className="h-8 w-8 text-muted-foreground/30" />
//                           </div>
                          
//                           <div className="flex-1">
//                             <h4 className="font-medium text-sm">{item.name}</h4>
//                             <p className="text-xs text-muted-foreground mt-1">
//                               Qty: {item.quantity} × ETB {item.price}
//                             </p>
//                             {item.variantSku && (
//                               <p className="text-[10px] text-muted-foreground font-mono">SKU: {item.variantSku}</p>
//                             )}
//                           </div>
//                           <div className="text-sm font-medium">
//                             ETB {(item.price * item.quantity).toLocaleString()}
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <Separator className="my-6" />

//                     {/* Order Details Footer */}
//                     <div className="grid sm:grid-cols-2 gap-6 text-sm">
//                       <div>
//                         <h5 className="font-semibold mb-2 flex items-center gap-2">
//                           <MapPin className="h-4 w-4 text-muted-foreground" /> Shipping To
//                         </h5>
//                         <div className="text-muted-foreground space-y-0.5">
//                           <p>{order.shippingAddress.fullName}</p>
//                           <p>{order.shippingAddress.phone}</p>
//                           <p>{order.shippingAddress.subCity}, {order.shippingAddress.city}</p>
//                           {order.shippingAddress.houseNumber && <p>House No: {order.shippingAddress.houseNumber}</p>}
//                         </div>
//                       </div>
//                       <div>
//                         <h5 className="font-semibold mb-2 flex items-center gap-2">
//                           <CreditCard className="h-4 w-4 text-muted-foreground" /> Payment Method
//                         </h5>
//                         <p className="text-muted-foreground">
//                           {order.paymentMethod} 
//                           {order.paymentMethod === 'Bank Transfer' && " (Manual Verification)"}
//                         </p>
//                         {order.transactionReference && order.paymentMethod === 'Chapa' && (
//                            <p className="text-xs text-muted-foreground mt-1 font-mono">Ref: {order.transactionReference}</p>
//                         )}
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </div>
//       </div>
//     </div>
//   );
// }




import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/session";
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { User as UserIcon, Mail, Shield, Package } from "lucide-react";
import "@/models/User";

export default async function ProfilePage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="container py-12 max-w-2xl">
      <h1 className="text-3xl font-bold mb-8">My Profile</h1>

      <Card>
        <CardHeader className="text-center pb-8 border-b bg-muted/20">
          <div className="mx-auto bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-4">
            <span className="text-4xl font-bold text-primary">
              {user.name?.charAt(0).toUpperCase()}
            </span>
          </div>
          <CardTitle className="text-2xl">{user.name}</CardTitle>
          <CardDescription className="flex items-center justify-center gap-2">
             <Mail className="h-4 w-4" /> {user.email}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 pt-8">
          
          <div className="grid gap-2">
            <h3 className="text-sm font-medium text-muted-foreground">Account Details</h3>
            <div className="p-4 border rounded-lg bg-card">
               <div className="flex items-center gap-3">
                 <UserIcon className="h-5 w-5 text-muted-foreground" />
                 <div>
                   <p className="text-sm font-medium">User ID</p>
                   <p className="text-xs text-muted-foreground font-mono">{user.id}</p>
                 </div>
               </div>
            </div>
            
            {/* Show Admin Badge if applicable */}
            {(user.role === 'admin' || user.role === 'superadmin') && (
               <div className="p-4 border rounded-lg bg-blue-50 border-blue-100 text-blue-900">
                 <div className="flex items-center gap-3">
                   <Shield className="h-5 w-5" />
                   <div>
                     <p className="text-sm font-bold capitalize">{user.role} Access</p>
                     <p className="text-xs opacity-80">You have staff privileges to manage the store.</p>
                   </div>
                 </div>
               </div>
            )}
          </div>

          <div className="grid gap-3 pt-2">
            <Button asChild size="lg" className="w-full h-12 text-base">
              <Link href="/orders">
                <Package className="mr-2 h-5 w-5" /> View Order History
              </Link>
            </Button>
            
            {(user.role === 'admin' || user.role === 'superadmin') && (
               <Button asChild variant="outline" className="w-full">
                 <Link href="/admin">Go to Admin Dashboard</Link>
               </Button>
            )}
          </div>

        </CardContent>
      </Card>
    </div>
  );
}