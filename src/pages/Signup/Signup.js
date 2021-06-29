import React, { useState, useEffect } from 'react';
import {db, firebaseApp, firebase } from '../../firebase'
import { Link, useHistory } from 'react-router-dom';

import {
	Layout,
	Container,
	Header,
	FormLabel,
	FormTextInput,
	FormCheckbox,
	FormRowContainer,
	FormSelect,
	FormButton,
	FormSubtitle
} from '../../styles/Form'

const Signup = () => {
	const history = useHistory();

	/* STATES */
	const [userObject, setUserObject] = useState({
		email: '',
		password: '',
		nickname: '',
		signupPath: 'search'
	});

	const [isAgreeInfo, setIsAgreeInfo] = useState(false);

	const { email, password, nickname, signupPath } = userObject;

	/* VALIDATION FUNCTIONS */

	const validateEmail = (email) => {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email.toLowerCase());
	}

	const validateForm = ({email, password, nickname}, isAgreeInfo) => {
		if (password.length < 6) {
			alert('Your Password is too short. Please enter a password longer than 6 characters.');
			return false;
		}

		if (!validateEmail(email)) {
			alert('Your email is invalid.');
			return false;
		}

		if (nickname.length < 2) {
			alert('Your Nickname is too short. Please enter a nickname longer than 2 characters.');
			return false;
		}

		if (!isAgreeInfo) {
			alert('You need to agree to the Privacy Policy and Cookie Policy to proceed.')
			return false;
		}

		return true;
	}

		/* EVENT FUNCTIONS */

		const onChangeUserObject = (e, type) => {
			setUserObject({
				...userObject,
				[type]: e.target.value
			})
		}
	
		const onChangeIsAgreeInfo = () => setIsAgreeInfo(prev => !prev);
	
		const onSubmitSignup = async () => {
			if (validateForm(userObject, isAgreeInfo)) {
				try {
					await firebaseApp.auth().createUserWithEmailAndPassword(email, password)
					const uid = (firebaseApp.auth().currentUser || {}).uid

					console.log(uid)
	
					if (uid) {
						const payload = {
							...userObject,
							isAgreeInfo,
							uid: uid,
							created: firebase.firestore.Timestamp.now().seconds
						}

						await db
							.collection('users')
							.doc(uid)
							.set(payload);

						history.push('/users/login');

					} else{
						alert('error');
					}
				} catch (e) {
					// setLoading(false);
					alert(e.message);
				}
			}
		}

	return (
		<Layout>
			<Container>
				<Header>Sign up to Chat App</Header>

				<FormLabel>Email</FormLabel>
				<FormTextInput type="text" value={email} onChange={e => onChangeUserObject(e, 'email')}/>

				<FormLabel>Nickname</FormLabel>
				<FormTextInput type="text" value={nickname} onChange={e => onChangeUserObject(e, 'nickname')}/>

				<FormLabel>Password</FormLabel>
				<FormTextInput type="password" value={password} onChange={e => onChangeUserObject(e, 'password')}/>

				<FormRowContainer>
					<FormLabel row>How did you know about his application?</FormLabel>
					<FormSelect value={signupPath} onChange={e => onChangeUserObject(e, 'signupPath')}>
						<option value={"search"}>Google Search</option>
						<option value={"advertisement"}>Advertisement</option>
						<option value={"other"}>Other</option>
					</FormSelect>
				</FormRowContainer>

				<FormRowContainer>
					<FormLabel row>I agree to the User Agreement Privacy Policy and Cookie Policy</FormLabel>
					<FormCheckbox type="checkbox" checked={isAgreeInfo} onChange={() => onChangeIsAgreeInfo()}/>
				</FormRowContainer>

				<FormButton onClick={onSubmitSignup}>
					Create Account
				</FormButton>

				<FormSubtitle>
					<Link to="/users/login">Already have an account?</Link>
				</FormSubtitle>

			</Container>
		</Layout>
	)
}

export default Signup