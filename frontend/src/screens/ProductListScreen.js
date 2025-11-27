import {
  Box,
  Button,
  Flex,
  Heading,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  useColorModeValue,
  Text,
  Stack,
  useBreakpointValue,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoAdd, IoPencilSharp, IoTrashBinSharp, IoSearch } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  createProduct,
  deleteProduct,
  listProducts,
} from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { PRODUCT_CREATE_RESET } from "../constants/productConstants";

const ProductListScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [searchTerm, setSearchTerm] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const productList = useSelector((state) => state.productList);
  const { loading, error, products } = productList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productDelete = useSelector((state) => state.productDelete);
  const { loading: loadingDelete, error: errorDelete, success: successDelete } =
    productDelete;

  const productCreate = useSelector((state) => state.productCreate);
  const {
    loading: loadingCreate,
    error: errorCreate,
    success: successCreate,
    product: createdProduct,
  } = productCreate;

  const bgColor = useColorModeValue("white", "gray.800");
  const hoverColor = useColorModeValue("gray.100", "gray.700");
  const tableHeaderColor = useColorModeValue("gray.200", "gray.700");

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    dispatch({ type: PRODUCT_CREATE_RESET });

    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
    }

    if (successCreate) {
      navigate(`/admin/product/${createdProduct._id}/edit`);
    } else {
      dispatch(listProducts());
    }
  }, [dispatch, navigate, userInfo, successDelete, successCreate, createdProduct]);

  const deleteHandler = (id) => {
    setDeleteId(id);
    onOpen();
  };

  const confirmDeleteHandler = () => {
    dispatch(deleteProduct(deleteId));
    onClose();
  };

  const createProductHandler = () => {
    dispatch(createProduct());
  };

  const filteredProducts = (products || []).filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <>
      <Flex
        mb="5"
        alignItems={{ base: "flex-start", md: "center" }}
        justifyContent="space-between"
        flexDirection={{ base: "column", md: "row" }}
        gap={{ base: 4, md: 0 }}
      >
        <Heading as="h1" fontSize={{ base: "2xl", md: "3xl" }}>
          Products
        </Heading>
        <Button
          onClick={createProductHandler}
          colorScheme="teal"
          size={{ base: "md", md: "lg" }}
          leftIcon={<IoAdd />}
        >
          Create Product
        </Button>
      </Flex>

      <InputGroup mb="4">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <InputRightElement>
          <Icon as={IoSearch} color="gray.500" />
        </InputRightElement>
      </InputGroup>

      {loadingDelete && <Loader />}
      {errorDelete && <Message type="error">{errorDelete}</Message>}
      {loadingCreate && <Loader />}
      {errorCreate && <Message type="error">{errorCreate}</Message>}

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Box
          bgColor={bgColor}
          rounded="lg"
          shadow="lg"
          px={{ base: 2, md: 5 }}
          py={{ base: 2, md: 5 }}
          mt="4"
          mx={{ base: 2, md: 5 }}
        >
          {!isMobile ? (
            <Box overflowX="auto">
              <Table variant="striped" size="sm">
                <Thead bgColor={tableHeaderColor}>
                  <Tr>
                    <Th>ID</Th>
                    <Th>NAME</Th>
                    <Th>PRICE</Th>
                    <Th>CATEGORY</Th>
                    <Th>BRAND</Th>
                    <Th>ACTIONS</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {filteredProducts.map((product) => (
                    <Tr key={product._id} _hover={{ bg: hoverColor }}>
                      <Td>{product._id}</Td>
                      <Td>{product.name}</Td>
                      <Td>₹{Number(product.price).toFixed(2)}</Td>
                      <Td>{product.category}</Td>
                      <Td>{product.brand}</Td>
                      <Td>
                        <Flex gap={2} justify="flex-end">
                          <Button
                            as={RouterLink}
                            to={`/admin/product/${product._id}/edit`}
                            colorScheme="teal"
                            size="sm"
                            variant="outline"
                            leftIcon={<IoPencilSharp />}
                          >
                            Edit
                          </Button>
                          <Button
                            colorScheme="red"
                            size="sm"
                            onClick={() => deleteHandler(product._id)}
                            leftIcon={<IoTrashBinSharp />}
                          >
                            Delete
                          </Button>
                        </Flex>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            </Box>
          ) : (
            <Stack spacing={4}>
              {filteredProducts.map((product) => (
                <Box
                  key={product._id}
                  borderWidth="1px"
                  borderRadius="lg"
                  overflow="hidden"
                  shadow="sm"
                  p={4}
                  bgColor={bgColor}
                >
                  <Flex justifyContent="space-between" alignItems="center" mb={2}>
                    <Text fontSize="sm" fontWeight="bold" color="gray.600">
                      ID: {product._id}
                    </Text>
                    <Flex gap={2} direction="column">
                      <Button
                        as={RouterLink}
                        to={`/admin/product/${product._id}/edit`}
                        colorScheme="teal"
                        size="sm"
                        variant="outline"
                        leftIcon={<IoPencilSharp />}
                      >
                        Edit
                      </Button>
                      <Button
                        colorScheme="red"
                        size="sm"
                        onClick={() => deleteHandler(product._id)}
                        leftIcon={<IoTrashBinSharp />}
                      >
                        Delete
                      </Button>
                    </Flex>
                  </Flex>
                  <Text fontWeight="medium" color="gray.700">
                    {product.name}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Price: ₹{Number(product.price).toFixed(2)}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Category: {product.category}
                  </Text>
                  <Text fontSize="sm" color="gray.600">
                    Brand: {product.brand}
                  </Text>
                </Box>
              ))}
            </Stack>
          )}
        </Box>
      )}

      {/* Confirm Delete Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Delete</ModalHeader>
          <ModalBody>Are you sure you want to delete this product?</ModalBody>
          <ModalFooter>
            <Button colorScheme="red" mr={3} onClick={confirmDeleteHandler}>
              Delete
            </Button>
            <Button variant="ghost" onClick={onClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProductListScreen;



