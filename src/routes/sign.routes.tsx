import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SignIn, SignUp } from '../screens';

const { Navigator, Screen } = createNativeStackNavigator();

export function SignRoutes() {
	return (
		<Navigator
			screenOptions={{
				headerShown: false,
			}}
		>
			<Screen name='signIn' component={SignIn} />
			<Screen name='signUp' component={SignUp} />
		</Navigator>
	);
}
