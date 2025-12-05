import CardOrderKitchen from "@/components/orders/CardOrderKitchen";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsContent } from "@radix-ui/react-tabs";
import { useState } from "react";

function Kitchen() {
    const [activeTab, setActiveTab] = useState("pending")

    return (
        <div className="px-4 lg:px-6">
            <div className="block justify-between items-center mb-5">
                <div>
                    <h3 className="text-gray-500">Vista Ordenes</h3>
                    <h1 className="text-2xl font-bold">
                        Tomar <span className="text-primary">Pedido para Mesa</span>
                    </h1>
                </div>
                <Tabs defaultValue={activeTab} onValueChange={setActiveTab}>
                    <TabsList>
                        <TabsTrigger value="pending">Pendientes</TabsTrigger>
                        <TabsTrigger value="completed">Completados</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending">
                        <CardOrderKitchen filter="pending" />
                    </TabsContent>

                    <TabsContent value="completed">
                        <div className="flex justify-end">
                            <Button variant="destructive">Limpiar Ordenes</Button>
                        </div>
                        <CardOrderKitchen filter="completed" />
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default Kitchen