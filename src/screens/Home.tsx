import React, { useEffect, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import {
	HStack,
	IconButton,
	VStack,
	useTheme,
	Text,
	Heading,
	FlatList,
	Center,
} from 'native-base';
import { ChatTeardropText, SignOut } from 'phosphor-react-native';

import Logo from '../assets/logo_secondary.svg';
import { Button, Filter, Loading, Order, OrderProps } from '../components';
import { dateFormat } from '../utils/firestoreDateFormat';

export function Home() {
	const [statusSelected, setStatusSelected] = useState<'open' | 'closed'>(
		'open'
	);
	const [orders, setOrders] = useState<OrderProps[]>([]);
	const [isLoading, setIsLoading] = useState(true);

	const navigation = useNavigation();
	const { colors } = useTheme();

	function handleNewOrder() {
		navigation.navigate('new');
	}

	function handleOpenDetails(orderId: string) {
		navigation.navigate('details', { orderId });
	}
	function handleLogout() {
		auth()
			.signOut()
			.catch((error) => {
				console.log('erro ao fazer logout: ', error);
				return Alert.alert('Sair', 'Não foi possível sair.');
			});
	}

	useEffect(() => {
		setIsLoading(true);

		const subscriber = firestore()
			.collection('orders')
			.where('status', '==', statusSelected)
			.onSnapshot((snapshot) => {
				const data = snapshot.docs.map((doc) => {
					const { patrimony, description, status, created_at } = doc.data();

					return {
						id: doc.id,
						patrimony,
						description,
						status,
						when: dateFormat(created_at),
					};
				});

				setOrders(data);
				setIsLoading(false);
			});

		return subscriber;
	}, [statusSelected]);

	return (
		<VStack flex={1} pb={6} bg='gray.700'>
			<HStack
				w='full'
				justifyContent='space-between'
				alignItems='center'
				bg='gray.600'
				pt={12}
				pb={5}
				px={6}
			>
				<Logo />
				<IconButton
					icon={<SignOut size={26} color={colors.gray[300]} />}
					onPress={handleLogout}
				/>
			</HStack>

			<VStack flex={1} px={6}>
				<HStack
					w='full'
					justifyContent='space-between'
					alignItems='center'
					mt={8}
					mb={4}
				>
					<Heading color='gray.100'>Solicitações</Heading>
					<Text color='gray.200'>{orders.length}</Text>
				</HStack>

				<HStack space={3} mb={8}>
					<Filter
						title='em andamento'
						type='open'
						onPress={() => setStatusSelected('open')}
						isActive={statusSelected === 'open'}
					/>
					<Filter
						title='finalizados'
						type='closed'
						onPress={() => setStatusSelected('closed')}
						isActive={statusSelected === 'closed'}
					/>
				</HStack>

				{isLoading ? (
					<Loading />
				) : (
					<FlatList
						data={orders}
						keyExtractor={(item) => item.id}
						renderItem={({ item }) => (
							<Order data={item} onPress={() => handleOpenDetails(item.id)} />
						)}
						showsVerticalScrollIndicator={false}
						contentContainerStyle={{ paddingBottom: 100 }}
						ListEmptyComponent={() => (
							<Center>
								<ChatTeardropText color={colors.gray[300]} size={40} />
								<Text color='gray.300' fontSize='xl' mt={6} textAlign='center'>
									Você ainda não possui{'\n'}
									solicitações{' '}
									{statusSelected === 'open' ? 'em andamento' : 'finalizadas'}
								</Text>
							</Center>
						)}
					/>
				)}

				<Button title='Nova solicitação' onPress={handleNewOrder} />
			</VStack>
		</VStack>
	);
}
