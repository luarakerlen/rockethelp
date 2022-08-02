import { useState } from 'react';
import { Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import { Heading, Icon, useTheme, VStack } from 'native-base';
import { Envelope, Key } from 'phosphor-react-native';

import Logo from '../assets/logo_primary.svg';
import { Button, Input } from '../components';

export function SignUp() {
	const [isLoading, setIsLoading] = useState(false);
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [passwordConfirmation, setPasswordConfirmation] = useState('');

	const { colors } = useTheme();

	function handleSignIn() {
		auth()
			.signInWithEmailAndPassword(email, password)
			.then((response) => {
				console.log('resposta ao entrar: ', response);
			})
			.catch((error) => {
				console.log('erro ao fazer login: ', error.code);
				setIsLoading(false);

				if (error.code === 'auth/invalid-email') {
					return Alert.alert('Entrar', 'E-mail inválido.');
				}

				if (error.code === 'auth/user-not-found') {
					return Alert.alert('Entrar', 'E-mail ou senha inválida.');
				}

				if (error.code === 'auth/wrong-password') {
					return Alert.alert('Entrar', 'E-mail ou senha inválida.');
				}

				return Alert.alert('Entrar', 'Não foi possível acessar.');
			});
	}

	function handleSignUp() {
		if (!email || !password || !passwordConfirmation) {
			return Alert.alert('Cadastrar', 'Preencha todos os campos.');
		}

		if (password !== passwordConfirmation) {
			return Alert.alert('Cadastrar', 'As senhas devem ser iguais.');
		}

		setIsLoading(true);

		auth()
			.createUserWithEmailAndPassword(email, password)
			.then((response) => {
				console.log('resposta ao cadastrar: ', response);
				handleSignIn();
			})
			.catch((error) => {
				if (error.code === 'auth/invalid-email') {
					return Alert.alert('Cadastrar', 'E-mail inválido.');
				}

				if (error.code === 'auth/email-already-in-use') {
					return Alert.alert('Cadastrar', 'O e-mail informado já está em uso.');
				}

				return Alert.alert(
					'Cadastrar',
					'Não foi possível realizar o cadastro.'
				);
			});

		setIsLoading(false);
	}

	return (
		<VStack flex={1} alignItems='center' bg='gray.600' px={8} pt={24}>
			<Logo />
			<Heading color='gray.100' fontSize='xl' mt={20} mb={6}>
				Crie sua conta
			</Heading>
			<Input
				mb={4}
				placeholder='E-mail'
				InputLeftElement={
					<Icon as={<Envelope color={colors.gray[300]} />} ml={4} />
				}
				onChangeText={setEmail}
			/>
			<Input
				mb={4}
				placeholder='Senha'
				InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
				secureTextEntry
				onChangeText={setPassword}
			/>
			<Input
				mb={8}
				placeholder='Confirmação de senha'
				InputLeftElement={<Icon as={<Key color={colors.gray[300]} />} ml={4} />}
				secureTextEntry
				onChangeText={setPasswordConfirmation}
			/>
			<Button
				title='Cadastrar'
				w='full'
				isLoading={isLoading}
				onPress={handleSignUp}
			/>
		</VStack>
	);
}
