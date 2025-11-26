import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Image,
  Select,
  Text,
  Textarea,
  VStack,
  Divider,
  useColorModeValue,
  Stack,
  Badge,
  Avatar,
  Card,
  CardBody,
  CardHeader,
} from "@chakra-ui/react";
import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate, useParams } from "react-router-dom";
import { createProductReview, listProductDetails } from "../actions/productActions";
import Loader from "../components/Loader";
import Message from "../components/Message";
import Rating from "../components/Rating";
import { PRODUCT_REVIEW_CREATE_RESET } from "../constants/productConstants";

const ProductScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();
  const reviewRef = useRef(null);

  const [qty, setQty] = useState(1);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const productDetails = useSelector((state) => state.productDetails);
  const { loading, error, product } = productDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const productReviewCreate = useSelector((state) => state.productReviewCreate);
  const { success: successProductReview, error: errorProductReview } =
    productReviewCreate;

  const bg = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("gray.50", "gray.700");

  useEffect(() => {
    if (successProductReview) {
      setRating(0);
      setComment("");
      dispatch({ type: PRODUCT_REVIEW_CREATE_RESET });

      // Smooth scroll to review section
      if (reviewRef.current) {
        reviewRef.current.scrollIntoView({ behavior: "smooth" });
      }
    }
    dispatch(listProductDetails(id));
  }, [id, dispatch, successProductReview]);

  const addToCartHandler = () => {
    navigate(`/cart/${id}?qty=${qty}`);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (comment.trim().length < 10) {
      alert("Review must be at least 10 characters.");
      return;
    }

    dispatch(createProductReview(id, { rating, comment }));
  };

  return (
    <>
      <Flex mb="5">
        <Button
          as={RouterLink}
          to="/"
          colorScheme="teal"
          variant="outline"
          size="sm"
        >
          ← Back to Home
        </Button>
      </Flex>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message type="error">{error}</Message>
      ) : (
        <Grid
          templateColumns={{ base: "1fr", md: "2fr 1fr" }}
          gap="10"
          py="8"
          px={{ base: "2", md: "8" }}
        >
          {/* Product Image */}
          <Flex align="center" justify="center" p="4">
            <Image
              src={product.image}
              alt={product.name}
              objectFit="contain"
              w="100%"
              maxH="550px"
              rounded="lg"
              shadow="md"
            />
          </Flex>

          {/* Product Info Card */}
          <Card bg={bg} shadow="lg" rounded="lg">
            <CardBody>
              <VStack align="flex-start" spacing="4">
                <Heading fontSize="3xl" color="teal.600">
                  {product.name}
                </Heading>

                <Flex align="center" gap="3">
                  <Rating
                    value={product.rating}
                    text={`${product.numReviews} Reviews`}
                  />
                </Flex>

                <Text fontSize="lg" color="gray.600">
                  Brand: <b>{product.brand}</b>
                </Text>

                <Divider />

                <Text fontSize="3xl" fontWeight="bold" color="teal.700">
                  ₹{product.price}
                </Text>

                <Badge
                  colorScheme={product.countInStock > 0 ? "green" : "red"}
                  fontSize="md"
                  py="1"
                  px="3"
                  borderRadius="md"
                >
                  {product.countInStock > 0 ? "In Stock" : "Out of Stock"}
                </Badge>

                <Text mt="4" color="gray.700" lineHeight="1.7">
                  {product.description}
                </Text>
              </VStack>

              {/* Cart Interaction */}
              <Box mt="8">
                {product.countInStock > 0 && (
                  <Flex align="center" mb="4">
                    <Text mr="4" fontWeight="bold">
                      Quantity:
                    </Text>
                    <Select
                      value={qty}
                      onChange={(e) => setQty(e.target.value)}
                      maxW="120px"
                      borderColor="teal.500"
                    >
                      {[...Array(product.countInStock).keys()].map((x) => (
                        <option key={x + 1} value={x + 1}>
                          {x + 1}
                        </option>
                      ))}
                    </Select>
                  </Flex>
                )}
                <Button
                  colorScheme="teal"
                  width="full"
                  onClick={addToCartHandler}
                  isDisabled={product.countInStock === 0}
                  size="lg"
                >
                  {product.countInStock > 0 ? "Add to Cart" : "Out of Stock"}
                </Button>
              </Box>
            </CardBody>
          </Card>
        </Grid>
      )}

      {/* Review Section */}
      {!loading && !error && (
        <Box
          mt="12"
          p={{ base: "4", md: "8" }}
          bg={bg}
          borderRadius="lg"
          boxShadow="md"
          ref={reviewRef}
        >
          <Heading as="h3" size="lg" mb="6" color="teal.700">
            Customer Reviews
          </Heading>

          {/* Review Cards */}
          {product.reviews.length === 0 ? (
            <Message>No Reviews Yet</Message>
          ) : (
            <Stack spacing="6">
              {product.reviews.map((review) => (
                <Card key={review._id} bg={cardBg} shadow="sm" rounded="md">
                  <CardHeader>
                    <Flex gap="3" align="center">
                      <Avatar name={review.name} />
                      <Box>
                        <Text fontWeight="bold">{review.name}</Text>
                        <Rating value={review.rating} />
                      </Box>
                    </Flex>
                  </CardHeader>
                  <CardBody pt="0">
                    <Text color="gray.600">{review.comment}</Text>
                    <Text mt="2" fontSize="sm" color="gray.500">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </Text>
                  </CardBody>
                </Card>
              ))}
            </Stack>
          )}

          {/* Review Form */}
          <Box mt="10">
            {errorProductReview && (
              <Message type="error">{errorProductReview}</Message>
            )}

            {userInfo ? (
              <form onSubmit={submitHandler}>
                <Stack spacing="4">
                  <FormControl isRequired>
                    <FormLabel fontWeight="bold">Rating</FormLabel>
                    <Select
                      placeholder="Select Rating"
                      value={rating}
                      onChange={(e) => setRating(Number(e.target.value))}
                      borderColor="teal.500"
                    >
                      <option value="1">⭐ Poor</option>
                      <option value="2">⭐⭐ Fair</option>
                      <option value="3">⭐⭐⭐ Good</option>
                      <option value="4">⭐⭐⭐⭐ Very Good</option>
                      <option value="5">⭐⭐⭐⭐⭐ Excellent</option>
                    </Select>
                  </FormControl>

                  <FormControl isRequired>
                    <FormLabel fontWeight="bold">Your Review</FormLabel>
                    <Textarea
                      placeholder="Write something helpful and honest..."
                      value={comment}
                      onChange={(e) => {
                        if (e.target.value.length <= 200)
                          setComment(e.target.value);
                      }}
                      borderColor="teal.500"
                      minH="130px"
                    />
                    <Text fontSize="sm" textAlign="right" color="gray.500">
                      {comment.length} / 200 characters
                    </Text>
                  </FormControl>

                  {comment.length > 0 && comment.length < 10 && (
                    <Text fontSize="sm" color="red.400">
                      Review must be at least 10 characters.
                    </Text>
                  )}

                  <Button
                    type="submit"
                    colorScheme="teal"
                    size="md"
                    isDisabled={comment.length < 10 || !rating}
                  >
                    Submit Review
                  </Button>
                </Stack>
              </form>
            ) : (
              <Message>
                Please <RouterLink to="/login">login</RouterLink> to write a
                review.
              </Message>
            )}
          </Box>
        </Box>
      )}
    </>
  );
};

export default ProductScreen;





