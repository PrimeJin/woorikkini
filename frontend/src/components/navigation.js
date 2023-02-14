import { useNavigation } from 'react-router-dom';
import App from '../App';

export default function navigation(props) {
  const navigation = useNavigation();

  return <App {...props} navigation={navigation} />;
}
