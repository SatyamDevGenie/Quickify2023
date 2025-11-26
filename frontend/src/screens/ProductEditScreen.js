import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Box,
  VStack,
  useToast,
  IconButton,
  Image,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { listProductDetails, updateProduct } from "../actions/productActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
import { FaArrowLeft } from "react-icons/fa";
import axios from "axios";

const ProductEditScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const toast = useToast();

  const { id: productId } = useParams();

  const [name, setName] = useState("");
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState("");
  const [brand, setBrand] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [countInStock, setCountInStock] = useState("");
  const [uploading, setUploading] = useState(false);

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const productUpdate = useSelector((state) => state.productUpdate);
  const {
    loading: loadingUpdate,
    error: errorUpdate,
    success: successUpdate,
  } = productUpdate;

  useEffect(() => {
    if (successUpdate) {
      toast({
        title: "Product Updated.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      dispatch({ type: PRODUCT_UPDATE_RESET });
      navigate(`/admin/productlist`);
    } else {
      if (!product.name || product._id !== productId) {
        dispatch(listProductDetails(productId));
      } else {
        setName(product.name);
        setPrice(product.price);
        setImage(product.image);
        setBrand(product.brand);
        setCategory(product.category);
        setCountInStock(product.countInStock);
        setDescription(product.description);
      }
    }
  }, [dispatch, navigate, productId, product, successUpdate, toast]);

  const submitHandler = (e) => {
    e.preventDefault();
    dispatch(
      updateProduct({
        _id: productId,
        name,
        price,
        image,
        brand,
        category,
        description,
        countInStock,
      })
    );
  };

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("image", file);

    try {
      setUploading(true);
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post(`/api/uploads`, formData, config);

      // backend returns { url, public_id }
      setImage(data.url || data.secure_url || data);
      setUploading(false);
      toast({
        title: "Image uploaded",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    } catch (err) {
      console.error(err);
      setUploading(false);
      toast({
        title: "Upload failed",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <Box px={8} py={4}>
        <IconButton
          as={RouterLink}
          to="/admin/productlist"
          icon={<FaArrowLeft />}
          aria-label="Go Back"
          mb={5}
          colorScheme="teal"
        />

        <Flex w="full" alignItems="center" justifyContent="center" py="5">
          <FormContainer>
            <Heading as="h1" mb="8" fontSize="3xl">
              Edit Product
            </Heading>

            {loadingUpdate && <Loader />}
            {errorUpdate && <Message type="error">{errorUpdate}</Message>}

            {loading ? (
              <Loader />
            ) : error ? (
              <Message type="error">{error}</Message>
            ) : (
              <form onSubmit={submitHandler}>
                <VStack spacing={4}>
                  <FormControl id="name" isRequired>
                    <FormLabel>Name</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter name"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="price" isRequired>
                    <FormLabel>Price</FormLabel>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="image" isRequired>
                    <FormLabel>Image</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter image URL"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                    />
                    <Input type="file" onChange={uploadFileHandler} mt={2} />
                    {uploading && <Box>Uploading...</Box>}
                    {image && (
                      <Image src={image} alt="preview" boxSize="150px" objectFit="cover" mt={2} />
                    )}
                  </FormControl>

                  <FormControl id="description" isRequired>
                    <FormLabel>Description</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="brand" isRequired>
                    <FormLabel>Brand</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter brand"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="category" isRequired>
                    <FormLabel>Category</FormLabel>
                    <Input
                      type="text"
                      placeholder="Enter category"
                      value={category}
                      onChange={(e) => setCategory(e.target.value)}
                    />
                  </FormControl>

                  <FormControl id="countInStock" isRequired>
                    <FormLabel>Count In Stock</FormLabel>
                    <Input
                      type="number"
                      placeholder="Product in stock"
                      value={countInStock}
                      onChange={(e) => setCountInStock(e.target.value)}
                    />
                  </FormControl>

                  <Button
                    type="submit"
                    isLoading={loadingUpdate}
                    colorScheme="teal"
                    width="full"
                    mt={4}
                  >
                    Update Product
                  </Button>
                </VStack>
              </form>
            )}
          </FormContainer>
        </Flex>
      </Box>
    </>
  );
};

export default ProductEditScreen;





// import {
//   Button,
//   Flex,
//   FormControl,
//   FormLabel,
//   Heading,
//   Input,
//   Link,
//   Spacer,
//   Box,
//   VStack,
//   useToast,
//   IconButton,
// } from "@chakra-ui/react";
// import { useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
// import { listProductDetails, updateProduct } from "../actions/productActions";
// import FormContainer from "../components/FormContainer";
// import Loader from "../components/Loader";
// import Message from "../components/Message";
// import { PRODUCT_UPDATE_RESET } from "../constants/productConstants";
// import { FaArrowLeft } from "react-icons/fa";
// import axios from "axios";

// const ProductEditScreen = () => {
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const toast = useToast();

//   const { id: productId } = useParams();

//   const [name, setName] = useState("");
//   const [price, setPrice] = useState(0);
//   const [image, setImage] = useState("");
//   const [brand, setBrand] = useState("");
//   const [category, setCategory] = useState("");
//   const [description, setDescription] = useState("");
//   const [countInStock, setCountInStock] = useState("");

//   const productDetails = useSelector((state) => state.productDetails);
//   const { loading, error, product } = productDetails;

//   const productUpdate = useSelector((state) => state.productUpdate);
//   const {
//     loading: loadingUpdate,
//     error: errorUpdate,
//     success: successUpdate,
//   } = productUpdate;

//   useEffect(() => {
//     if (successUpdate) {
//       toast({
//         title: "Product Updated.",
//         status: "success",
//         duration: 3000,
//         isClosable: true,
//       });
//       dispatch({ type: PRODUCT_UPDATE_RESET });
//       navigate(`/admin/productlist`);
//     } else {
//       if (!product.name || product._id !== productId) {
//         dispatch(listProductDetails(productId));
//       } else {
//         setName(product.name);
//         setPrice(product.price);
//         setImage(product.image);
//         setBrand(product.brand);
//         setCategory(product.category);
//         setCountInStock(product.countInStock);
//         setDescription(product.description);
//       }
//     }
//   }, [dispatch, navigate, productId, product, successUpdate, toast]);

//   const submitHandler = (e) => {
//     e.preventDefault();
//     dispatch(
//       updateProduct({
//         _id: productId,
//         name,
//         price,
//         image,
//         brand,
//         category,
//         description,
//         countInStock,
//       })
//     );
//   };

//   const uploadFileHandler = async (e) => {
//     const file = e.target.files[0];
//     const formData = new FormData();
//     formData.append("image", file);

//     try {
//       const config = {
//         headers: {
//           "Content-Type": "multipart/form-data",
//         },
//       };

//       const { data } = await axios.post(`/api/uploads`, formData, config);
//       setImage(data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   return (
//     <>
//       <Box px={8} py={4}>
//         <IconButton
//           as={RouterLink}
//           to="/admin/productlist"
//           icon={<FaArrowLeft />}
//           aria-label="Go Back"
//           mb={5}
//           colorScheme="teal"
//         />

//         <Flex w="full" alignItems="center" justifyContent="center" py="5">
//           <FormContainer>
//             <Heading as="h1" mb="8" fontSize="3xl">
//               Edit Product
//             </Heading>

//             {loadingUpdate && <Loader />}
//             {errorUpdate && <Message type="error">{errorUpdate}</Message>}

//             {loading ? (
//               <Loader />
//             ) : error ? (
//               <Message type="error">{error}</Message>
//             ) : (
//               <form onSubmit={submitHandler}>
//                 <VStack spacing={4}>
//                   {/* NAME */}
//                   <FormControl id="name" isRequired>
//                     <FormLabel>Name</FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="Enter name"
//                       value={name}
//                       onChange={(e) => setName(e.target.value)}
//                     />
//                   </FormControl>

//                   {/* PRICE */}
//                   <FormControl id="price" isRequired>
//                     <FormLabel>Price</FormLabel>
//                     <Input
//                       type="number"
//                       placeholder="Enter price"
//                       value={price}
//                       onChange={(e) => setPrice(e.target.value)}
//                     />
//                   </FormControl>

//                   {/* IMAGE */}
//                   <FormControl id="image" isRequired>
//                     <FormLabel>Image</FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="Enter image URL"
//                       value={image}
//                       onChange={(e) => setImage(e.target.value)}
//                     />
//                     <Input type="file" onChange={uploadFileHandler} mt={2} />
//                   </FormControl>

//                   {/* DESCRIPTION */}
//                   <FormControl id="description" isRequired>
//                     <FormLabel>Description</FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="Enter description"
//                       value={description}
//                       onChange={(e) => setDescription(e.target.value)}
//                     />
//                   </FormControl>

//                   {/* BRAND */}
//                   <FormControl id="brand" isRequired>
//                     <FormLabel>Brand</FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="Enter brand"
//                       value={brand}
//                       onChange={(e) => setBrand(e.target.value)}
//                     />
//                   </FormControl>

//                   {/* CATEGORY */}
//                   <FormControl id="category" isRequired>
//                     <FormLabel>Category</FormLabel>
//                     <Input
//                       type="text"
//                       placeholder="Enter category"
//                       value={category}
//                       onChange={(e) => setCategory(e.target.value)}
//                     />
//                   </FormControl>

//                   {/* COUNT IN STOCK */}
//                   <FormControl id="countInStock" isRequired>
//                     <FormLabel>Count In Stock</FormLabel>
//                     <Input
//                       type="number"
//                       placeholder="Product in stock"
//                       value={countInStock}
//                       onChange={(e) => setCountInStock(e.target.value)}
//                     />
//                   </FormControl>

//                   <Button
//                     type="submit"
//                     isLoading={loadingUpdate}
//                     colorScheme="teal"
//                     width="full"
//                     mt={4}
//                   >
//                     Update Product
//                   </Button>
//                 </VStack>
//               </form>
//             )}
//           </FormContainer>
//         </Flex>
//       </Box>
//     </>
//   );
// };

// export default ProductEditScreen;



