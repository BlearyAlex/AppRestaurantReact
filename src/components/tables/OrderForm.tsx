import useProducts from "@/hooks/useProducts"
import { useEffect } from "react";
import { Tabs, TabsList, TabsTrigger } from "../ui/tabs";

function OrderForm({
    register,
    handleSubmit,
    errors,
    onSubmit,
    submitting,
    onCancel,
    submitText,
    products = [],
}: any) {

    const { data: productsData, fetchProducts} = useProducts();
    const availableProducts = products.length > 0 ? products : productsData;

    useEffect(() => {
        if (products.length === 0 && productsData.length === 0){
            fetchProducts();
        }
    }, []);

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <div>
                <Tabs>
                    <TabsList>
                        <TabsTrigger></TabsTrigger>
                    </TabsList>
                </Tabs>
            </div>
        </form>
    )
}