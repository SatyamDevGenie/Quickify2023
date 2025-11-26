import {
	Box,
	Button,
	Badge,
	Flex,
	Heading,
	Icon,
	SimpleGrid,
	Text,
	useColorModeValue,
	Stack,
} from '@chakra-ui/react';
import { useEffect } from 'react';
import { HiOutlineClipboardList } from 'react-icons/hi';
import { useDispatch, useSelector } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { listOrders } from '../actions/orderActions';
import Loader from '../components/Loader';
import Message from '../components/Message';

const OrderListScreen = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();

	const orderList = useSelector((state) => state.orderList);
	const { loading, error, orders } = orderList;

	const userLogin = useSelector((state) => state.userLogin);
	const { userInfo } = userLogin;

	// ✅ Hooks at top level
	const pageBg = useColorModeValue('gray.100', 'gray.900');
	const cardBg = useColorModeValue('white', 'gray.800');
	const cardHoverBg = useColorModeValue('gray.50', 'gray.700');

	useEffect(() => {
		if (userInfo && userInfo.isAdmin) {
			dispatch(listOrders());
		} else {
			navigate('/login');
		}
	}, [dispatch, userInfo, navigate]);

	return (
		<>
			<Flex align="center" justify="center" mb={6}>
				<Icon as={HiOutlineClipboardList} w={8} h={8} mr={3} color="teal.500" />
				<Heading as="h1" fontSize={{ base: '2xl', md: '3xl' }} textAlign="center">
					Order Management
				</Heading>
			</Flex>

			{loading ? (
				<Loader />
			) : error ? (
				<Message type="error">{error}</Message>
			) : orders.length === 0 ? (
				<Message type="info">No orders placed yet.</Message>
			) : (
				<Box
					bg={pageBg}
					p={{ base: 2, md: 5 }}
					rounded="lg"
					mx={{ base: 2, md: 10 }}
				>
					<SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={5}>
						{orders.map((order) => (
							<Box
								key={order._id}
								bg={cardBg}
								borderWidth="1px"
								borderRadius="md"
								shadow="md"
								p={5}
								transition="all 0.3s"
								_hover={{ bg: cardHoverBg, shadow: 'xl' }}
							>
								<Stack spacing={3}>
									<Flex justify="space-between" align="center">
										<Text fontWeight="bold" fontSize="md">
											Order #{order._id.substring(0, 8)}...
										</Text>
										<Button
											as={RouterLink}
											to={`/order/${order._id}`}
											size="sm"
											colorScheme="teal"
											variant="solid"
										>
											View Details
										</Button>
									</Flex>

									<Text fontSize="sm">
										<strong>User:</strong> {order.user && order.user.name}
									</Text>
									<Text fontSize="sm">
										<strong>Date:</strong> {order.createdAt.substring(0, 10)}
									</Text>
									<Text fontSize="sm">
										<strong>Total:</strong> ₹{order.totalPrice.toFixed(2)}
									</Text>

									<Flex gap={2} flexWrap="wrap">
										<Badge colorScheme={order.isPaid ? 'green' : 'red'}>
											{order.isPaid
												? `Paid: ${order.paidAt.substring(0, 10)}`
												: 'Not Paid'}
										</Badge>
										<Badge colorScheme={order.isDelivered ? 'green' : 'red'}>
											{order.isDelivered
												? `Delivered: ${order.deliveredAt.substring(0, 10)}`
												: 'Not Delivered'}
										</Badge>
									</Flex>
								</Stack>
							</Box>
						))}
					</SimpleGrid>
				</Box>
			)}
		</>
	);
};

export default OrderListScreen;
