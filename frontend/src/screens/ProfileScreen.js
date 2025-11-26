import {
  Button,
  Flex,
  FormControl,
  FormLabel,
  Grid,
  Heading,
  Icon,
  Input,
  Spacer,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
  Box,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { IoWarning } from "react-icons/io5";
import { useDispatch, useSelector } from "react-redux";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { listMyOrders } from "../actions/orderActions";
import { getUserDetails, updateUserProfile } from "../actions/userActions";
import FormContainer from "../components/FormContainer";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { USER_DETAILS_RESET } from "../constants/userConstants";

const ProfileScreen = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");

  const userDetails = useSelector((state) => state.userDetails);
  const { loading, error, user } = userDetails;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  const userUpdateProfile = useSelector((state) => state.userUpdateProfile);
  const { success } = userUpdateProfile;

  const orderMyList = useSelector((state) => state.orderMyList);
  const { loading: loadingOrders, error: errorOrders, orders } = orderMyList;

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      if (!user.name) {
        dispatch(getUserDetails());
        dispatch(listMyOrders());
      } else {
        setName(user.name);
        setEmail(user.email);
      }
    }
  }, [dispatch, navigate, user, userInfo, success]);

  const submitHandler = (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
    } else {
      dispatch(updateUserProfile({ id: user._id, name, email, password }));
    }

    dispatch({ type: USER_DETAILS_RESET });
  };

  const tableScroll = useBreakpointValue({ base: "auto", md: "unset" });

  return (
    <Grid
      templateColumns={{ base: "1fr", md: "1fr 1fr" }}
      py="5"
      gap={{ base: 6, md: 10 }}
      px={{ base: 2, md: 6 }}
    >
      {/* Profile Form */}
      <Flex w="full" alignItems="center" justifyContent="center" py="5">
        <FormContainer w="full">
          <Heading as="h1" mb="8" fontSize={{ base: "2xl", md: "3xl" }}>
            User Profile
          </Heading>

          {error && <Message type="error">{error}</Message>}
          {message && <Message type="error">{message}</Message>}

          <form onSubmit={submitHandler}>
            <FormControl id="name" mb="3">
              <FormLabel htmlFor="name">Your Name</FormLabel>
              <Input
                id="name"
                type="text"
                placeholder="Your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </FormControl>

            <FormControl id="email" mb="3">
              <FormLabel htmlFor="email">Email address</FormLabel>
              <Input
                id="email"
                type="email"
                placeholder="username@domain.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </FormControl>

            <FormControl id="password" mb="3">
              <FormLabel htmlFor="password">Password</FormLabel>
              <Input
                id="password"
                type="password"
                placeholder="************"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl id="confirmPassword" mb="4">
              <FormLabel htmlFor="confirmPassword">Confirm Password</FormLabel>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="************"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="teal"
              mt="2"
              isLoading={loading}
              width="full"
            >
              Update
            </Button>
          </form>
        </FormContainer>
      </Flex>

      {/* Orders Table */}
      <Flex direction="column" overflowX={tableScroll}>
        <Heading as="h2" mb="4" fontSize={{ base: "xl", md: "2xl" }}>
          My Orders
        </Heading>

        {loadingOrders ? (
          <Loader />
        ) : errorOrders ? (
          <Message type="error">{errorOrders}</Message>
        ) : (
          <Box overflowX="auto">
            <Table variant="striped" size={{ base: "sm", md: "md" }}>
              <Thead>
                <Tr>
                  <Th>ID</Th>
                  <Th>DATE</Th>
                  <Th>TOTAL</Th>
                  <Th>PAID</Th>
                  <Th>DELIVERED</Th>
                  <Th></Th>
                </Tr>
              </Thead>
              <Tbody>
                {orders.map((order) => (
                  <Tr key={order._id}>
                    <Td>{order._id}</Td>
                    <Td>{new Date(order.createdAt).toDateString()}</Td>
                    <Td>₹{order.totalPrice}</Td>
                    <Td>
                      {order.isPaid ? (
                        new Date(order.paidAt).toDateString()
                      ) : (
                        <Icon as={IoWarning} color="red.400" />
                      )}
                    </Td>
                    <Td>
                      {order.isDelivered ? (
                        new Date(order.deliveredAt).toDateString()
                      ) : (
                        <Icon as={IoWarning} color="red.400" />
                      )}
                    </Td>
                    <Td>
                      <Button
                        as={RouterLink}
                        to={`/order/${order._id}`}
                        colorScheme="teal"
                        size="sm"
                      >
                        Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Flex>
    </Grid>
  );
};

export default ProfileScreen;
