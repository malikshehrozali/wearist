import { Button } from '../../components/ui/button'
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '../../components/ui/sheet'
import React, { useEffect, useState } from 'react'
import { Input } from '../../components/ui/input'
import { Textarea } from '../../components/ui/textarea'
import { Label } from '../../components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select"
import { ShoppingBag, SquarePen, UploadCloudIcon } from 'lucide-react'
import { toast } from 'sonner'
import { useDispatch, useSelector } from 'react-redux'
import { createProduct, deleteProduct, fetchProducts, updateProduct } from '../../store/Shop/productSlice'


const Products = () => {
    const [openProductPanel, setOpenProductPanel] = useState(false);
    const [openProductEditPanel, setOpenProductEditPanel] = useState(false);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState(0);
    const [brand, setBrand] = useState("");
    const [stock, setStock] = useState(0);
    const [category, setCategory] = useState("");
    const [image, setImage] = useState();
    const [preview, setPreview] = useState(null);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editPrice, setEditPrice] = useState(0);
    const [editBrand, setEditBrand] = useState("");
    const [editStock, setEditStock] = useState(0);
    const [editCategory, setEditCategory] = useState("");
    const [editImage, setEditImage] = useState();
    const [editImagePreview, setEditImagePreview] = useState();
    const [editId, setEditId] = useState();
    const dispatch = useDispatch();
    const { productList } = useSelector(state => state.products)
    // Product creation
    const handleImageChange = (e) => {
        const file = e.target.files[0];


        if (!file) {
            console.log("Image is not uploaded on files");
            toast.error("Image is not uploaded on files")
            return;
        }
        setImage(file);
        setPreview(URL.createObjectURL(file));
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (!file) {
            console.log("Image is not uploaded on files");
            toast.error("Image is not uploaded on files")
            return;
        }
        setEditImage(file);
        setEditImagePreview(URL.createObjectURL(file));
    }

    const handleRemoveImage = () => {
        setImage(null);
        setPreview(null);
    };

    const handleRemoveEditImage = () => {
        setEditImage(null);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', name);
        formData.append('description', description);
        formData.append('price', price);
        formData.append('brand', brand);
        formData.append('stock', stock);
        formData.append('category', category);
        formData.append('image', image);

        try {
            const product = await dispatch(createProduct(formData)).unwrap();
            setOpenProductPanel(false);
            setName("");
            setDescription("");
            setPrice(0);
            setBrand("");
            setStock(0);
            setCategory("");
            setImage(null);
            setPreview(null);
            toast.success(product.name + " created successfully!");

        } catch (error) {
            console.log(error);
            toast.error(error);
        }

    };
    // product update or deletion
    const handleDeleteProduct = async ({ id, name }) => {
        try {
            window.confirm("Are you sure you want to delete this product?");
            console.log(id);
            const product = await dispatch(deleteProduct(id)).unwrap();
            if (product) {
                toast.success(name + " deleted successfully!");
            }
        } catch (error) {
            console.log(error);
            toast.error(error)

        }
    }

    const handleEditProduct = async (product) => {
        setOpenProductEditPanel(true);
        setEditName(product.name);
        setEditDescription(product.description);
        setEditPrice(product.price);
        setEditBrand(product.brand);
        setEditStock(product.stock);
        setEditCategory(product.category);
        setEditImage(product.image);
        setEditId(product._id);
    }
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append('name', editName);
        formData.append('description', editDescription);
        formData.append('price', editPrice);
        formData.append('brand', editBrand);
        formData.append('stock', editStock);
        formData.append('category', editCategory);
        formData.append('image', editImage);
        console.log(formData);
        try {
            const updated = await dispatch(updateProduct({ id: editId, formData })).unwrap();
            setOpenProductEditPanel(false);
            toast.success(updated.name + " updated successfully!");
        } catch (error) {
            console.log(error);
            toast.error(error)
        }
    }
    useEffect(() => {
        dispatch(fetchProducts()).unwrap()
    }, [dispatch])


    return (
        <>
            <div className='mb-5 w-full flex justify-end'>
                <Button onClick={() => setOpenProductPanel(true)}>Add New Product</Button>
            </div>
            <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4 '>
                <Sheet open={openProductPanel} onOpenChange={() => setOpenProductPanel(false)}>
                    <SheetContent side='right' className="w-full p-2 overflow-auto text-muted-foreground">
                        <SheetHeader className={"border-b text-shadow-yellow-original"}>
                            <SheetTitle className={"text-xl flex items-center gap-2"}><span><ShoppingBag /></span> Add New Product</SheetTitle>
                        </SheetHeader>
                        <div className=''>
                            <form onSubmit={handleSubmit} className="space-y-4" encType='multipart/form-data'>
                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Product Name</Label>
                                    <Input
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="e.g. Wearist Classic Tee"
                                        required
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Description</Label>
                                    <Textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Write product description..."
                                        required
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Price (USD)</Label>
                                    <Input
                                        type="number"
                                        value={price}
                                        onChange={(e) => setPrice(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Brand</Label>
                                    <Input
                                        value={brand}
                                        onChange={(e) => setBrand(e.target.value)}
                                        placeholder="Nike, Adidas, etc."
                                        required
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Stock</Label>
                                    <Input
                                        type="number"
                                        value={stock}
                                        onChange={(e) => setStock(e.target.value)}
                                        required
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Category</Label>
                                    <Select onValueChange={(value) => setCategory(value)}>
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="men">Men</SelectItem>
                                            <SelectItem value="women">Women</SelectItem>
                                            <SelectItem value="kids">Kids</SelectItem>
                                            <SelectItem value="accessories">Accessories</SelectItem>
                                            <SelectItem value="footwear">Footwear</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='flex flex-col gap-2 '>
                                    <Label className="text-lg">Image URL</Label>

                                    <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                            id="product-image"
                                            name='image'
                                            required
                                        />

                                        {!image ? (
                                            <Label
                                                htmlFor="product-image"
                                                className="flex flex-col items-center justify-center h-32 cursor-pointer"
                                            >
                                                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                                <span>Upload product image</span>
                                            </Label>
                                        ) : null}
                                        {preview && (
                                            <div className="flex items-center justify-center">
                                                <div className=" relative w-32 h-32">
                                                    <img
                                                        src={preview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveImage}
                                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="pt-4 flex justify-center">
                                    <Button type="submit">Save Product</Button>
                                </div>
                            </form>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div className='grid gap-4 md:grid-cols-3 lg:grid-cols-4 '>
                <Sheet open={openProductEditPanel} onOpenChange={() => setOpenProductEditPanel(false)}>
                    <SheetContent side='right' className="w-full p-2 overflow-auto text-muted-foreground">
                        <SheetHeader className={"border-b text-shadow-yellow-original"}>
                            <SheetTitle className={"text-xl flex items-center gap-2"}><span><SquarePen /></span> Edit Product</SheetTitle>
                        </SheetHeader>
                        <div className=''>
                            <form onSubmit={handleEditSubmit} className="space-y-4" encType='multipart/form-data'>
                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Product Name</Label>
                                    <Input
                                        value={editName}
                                        onChange={(e) => setEditName(e.target.value)}
                                        placeholder="e.g. Wearist Classic Tee"
                                    />
                                </div>
                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Description</Label>
                                    <Textarea
                                        value={editDescription}
                                        onChange={(e) => setEditDescription(e.target.value)}
                                        placeholder="Write product description..."
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Price (USD)</Label>
                                    <Input
                                        type="number"
                                        value={editPrice}
                                        onChange={(e) => setEditPrice(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Brand</Label>
                                    <Input
                                        value={editBrand}
                                        onChange={(e) => setEditBrand(e.target.value)}
                                        placeholder="Nike, Adidas, etc."
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Stock</Label>
                                    <Input
                                        type="number"
                                        value={editStock}
                                        onChange={(e) => setEditStock(e.target.value)}
                                    />
                                </div>

                                <div className='flex flex-col gap-2'>
                                    <Label className={"text-lg"}>Category</Label>
                                    <Select onValueChange={(value) => setEditCategory(value)} defaultValue={editCategory} >
                                        <SelectTrigger className="w-full">
                                            <SelectValue placeholder="Select Category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="men">Men</SelectItem>
                                            <SelectItem value="women">Women</SelectItem>
                                            <SelectItem value="kids">Kids</SelectItem>
                                            <SelectItem value="accessories">Accessories</SelectItem>
                                            <SelectItem value="footwear">Footwear</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className='flex flex-col gap-2 '>
                                    <Label className="text-lg">Image URL</Label>

                                    <div className="border-2 border-dashed rounded-lg p-4 mt-2">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleEditImageChange}
                                            className="hidden"
                                            id="product-image"
                                            name='image'
                                        />

                                        {!image ? (
                                            <Label
                                                htmlFor="product-image"
                                                className="flex flex-col items-center justify-center h-32 cursor-pointer"
                                            >
                                                <UploadCloudIcon className="w-10 h-10 text-muted-foreground mb-2" />
                                                <span>Upload product image</span>
                                            </Label>
                                        ) : null}
                                        {editImage && (
                                            <div className="flex items-center justify-center">
                                                <div className=" relative w-32 h-32">
                                                    <img
                                                        src={editImage || editImagePreview}
                                                        alt="Preview"
                                                        className="w-full h-full object-cover rounded border"
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={handleRemoveEditImage}
                                                        className="absolute top-0 right-0 bg-red-500 text-white text-xs px-2 py-1 rounded"
                                                    >
                                                        ✕
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                </div>

                                <div className="pt-4 flex justify-center">
                                    <Button type="submit">Save Product</Button>
                                </div>
                            </form>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
            <div>
                <div className="flex flex-col">
                    {/* Desktop / Large Screens */}
                    <div className="hidden md:block overflow-x-auto lg:-mx-8">
                        <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                            <div className="overflow-hidden">
                                <table className="min-w-full text-left text-sm font-light">
                                    <thead className="border-b font-medium dark:border-neutral-500">
                                        <tr>
                                            <th scope="col" className="px-6 py-4">Image</th>
                                            <th scope="col" className="px-6 py-4">Product</th>
                                            <th scope="col" className="px-6 py-4">Category</th>
                                            <th scope="col" className="px-6 py-4">Stock</th>
                                            <th scope="col" className="px-6 py-4">Price</th>
                                            <th scope="col" className="px-6 py-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {Array.isArray(productList) && productList?.map((product) => (
                                            <tr key={product._id} className="border-b dark:border-neutral-500 text-muted-foreground">
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">
                                                    {product?.image ? (
                                                        <img src={product.image} alt={product.name} className="w-12 h-12" />
                                                    ) : (
                                                        <span>No image</span>
                                                    )}
                                                </td>
                                                <td className="whitespace-nowrap px-6 py-4 font-medium">{product.name}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{product.category}</td>
                                                <td className="whitespace-nowrap px-6 py-4">{product.stock}</td>
                                                <td className="whitespace-nowrap px-6 py-4">${product.price}</td>
                                                <td className="whitespace-nowrap px-6 py-4 flex gap-2">
                                                    <Button size="sm" onClick={() => handleEditProduct(product)}>Edit</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct({ id: product._id, name: product.name })}>Delete</Button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    {/* Mobile / Small Screens */}
                    <div className="grid grid-cols-1 gap-4 md:hidden">
                        {productList?.map((product) => (
                            <div key={product._id} className="border rounded-lg p-4 shadow-sm flex items-start gap-4">
                                <img src={product.image} alt={product.name} className="w-20 h-20 rounded-md object-cover" />
                                <div className="flex-1">
                                    <h3 className="font-semibold text-base">{product.name}</h3>
                                    <p className="text-sm text-muted-foreground capitalize">{product.category}</p>
                                    <p className="text-sm">Stock: {product.stock}</p>
                                    <p className="text-sm font-medium">Price: ${product.price}</p>
                                    <div className="flex gap-2 mt-2">
                                        <Button size="sm" onClick={() => handleEditProduct(product)}>Edit</Button>
                                        <Button size="sm" variant="destructive" onClick={() => handleDeleteProduct(product._id)}>Delete</Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    )
}

export default Products