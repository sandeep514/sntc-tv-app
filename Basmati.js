import React, {useRef ,useState, useEffect} from 'react';
import { Pressable } from 'react-native';
import {Button,Image,StyleSheet,Text,View,FlatList,Item,ScrollView,} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';

export default function Basmati() {
	const [isLoading, setLoading] = useState(true);
	const [HasBasmatiContent, setHasBasmatiContent] = useState(false);
	const [HasNonBasmatiContent, setHasNonBasmatiContent] = useState(false);

	const [data, setData] = useState([]);
	const [basmati, setBasmatiData] = useState([]);
	const [nonbasmati, setNonbasmatiData] = useState([]);
	const [selectedState, setSelectedState] = useState([]);
	// const [counter, setCounter] = useState(0);

	const scrollRef = useRef(); 

	function getListState(){
		return new Promise( (resolve , reject) => {
			fetch('https://snjtradelink.com/admin/public/api/get/all/state/list')
			.then((response) => response.json())
			.then((json) => resolve(json.data) )
			.catch((error) => reject(error))
			.finally(() => setLoading(false));
		});
	}
	
	useEffect(() => {
		let counter = 0;
		let scrollcounter = 0;
		let availableStates = [];
		let stateLength = 0;
		getListState().then( ApiData => { 
			setData(ApiData);
			availableStates = ApiData;
			stateLength = ApiData.length;
			getStateData(ApiData[counter]);
			setSelectedState(ApiData[counter]);

		})
		
		setInterval(function(){
			counter = counter+1;
			
			if( (counter+1) > stateLength ){
				counter = 0;
				scrollcounter = 0;
				scrollRef.current?.scrollTo({
					x: scrollcounter,
					animated: true,
				});
			}else{
				scrollcounter = (scrollcounter+80);
				scrollRef.current?.scrollTo({
					x: scrollcounter,
					animated: true,
				});
			}
			
			getStateData(availableStates[counter]);
			setSelectedState(availableStates[counter]);

		}, 60000);

	}, []);
	
	const getStateData = (state) => {
		setSelectedState(state);

		fetch('https://snjtradelink.com/admin/public/api/get/all/basmati/'+state)
		.then((response) => response.json())
		.then((json) => setBasmatiData(json.prices.basmati) )
		.catch((error) => console.error(error))
		.finally(() => setHasBasmatiContent(true));

		fetch('https://snjtradelink.com/admin/public/api/get/all/nonbasmati/'+state)
		.then((response) => response.json())
		.then((json) => setNonbasmatiData(json.prices.non_basmati) )
		.catch((error) => console.error(error))
		.finally(() => setHasNonBasmatiContent(true));

	}
	
	return (
		<View style={styles.container}>
			<View >
				<ScrollView horizontal={true} ref={scrollRef}>
					<View style={[styles.displayhorizontal , styles.listStyle]}>
						{ (isLoading === true)  ? <Text>Loading...</Text> : 
							( Object.values(data).length > 0) ? 
								Object.values(data).map((m , k) => {
									return(
										<Pressable key={m} style={(selectedState == m) ? styles.activeState : styles.state } onPress={() => { getStateData(m) }}>
											<Text key={m}>{m}</Text>
										</Pressable>
									)
								})
							: <Text></Text>
						}
					</View>
				</ScrollView>
			</View>
			
			<ScrollView vertical={true}> 
				{(basmati != undefined) ? 
					(basmati.length > 0) ? 
						<View>
							<View >
								<Text style={{color: '#019340', fontSize: 22,marginTop: 5,marginLeft: 10,marginBottom: 5}}>
									Basmati
								</Text>
							</View>
							<View style={styles.flexDirectionRow}>
								{( HasBasmatiContent ) ? 
									(basmati != undefined) ?
										(basmati.length > 0)  ? 
											Object.values(basmati).map(( m , k) => { 
												return(
													<View  style={{marginTop: 10}}>
														<Text> {Object.keys(m)} </Text> 
														{Object.values(m).map(( n , i) => { 
															return(
																Object.values(n).map(( a , b) => { 
																	return(
																		<View key={b}>
																			<View style={styles.card}>
																				{Object.values(a).map((c ,d) => {
																					return(
																						Object.values(c).map((e ,f) => {	
																							return(
																								<View>
																								{( typeof(e) == 'object' ) ? 
																									<ListItem bottomDivider containerStyle={{backgroundColor: '#94b242' ,paddingVertical: 3,paddingLeft: 5,paddingRight: 5}}>
																										<Text style={styles.riceName}>{e.form_rel.form_name}</Text>
																										<ListItem.Content>
																											<ListItem.Title style={styles.cardtitle, (e.up_down == 'stable') ? styles.stable : (e.up_down == 'up') ? styles.up : styles.down }>Rs { e.min_price }-{e.max_price}</ListItem.Title>
																										</ListItem.Content>
																									</ListItem>
																									: null}
																								</View>
																							)	
																						})
																					)
																				})}
																			</View>
																		</View>
																	)
																})
															)
														})}
													</View>
												)
											})
										: <Text></Text> 
									: <Text></Text>
									
								: <Text></Text>}
							</View>
						</View>

					
					: null 
				: null }

				{(nonbasmati != undefined) ?
					(nonbasmati.length > 0) ?
						<View>
							<View >
								<Text style={{color: '#019340', fontSize: 22,marginTop: 25,marginLeft: 10,marginBottom: 5}}>
									Non Basmati
								</Text>
							</View>
							<View style={styles.flexDirectionRow}>
								{( HasNonBasmatiContent ) ? 
									(nonbasmati != undefined)  ? 
										(nonbasmati.length > 0)  ? 
											Object.values(nonbasmati).map(( m , k) => { 
													return(
														<View style={{marginTop: 10}}>
															<Text> {Object.keys(m)} </Text> 
															{Object.values(m).map(( n , i) => { 
																return(
																	Object.values(n).map(( a , b) => { 
																		return(
																			<View key={b}>
																				<View style={styles.card}>
																					{Object.values(a).map((c ,d) => {
																						return(
																							Object.values(c).map((e ,f) => {	
																								return(
																									<View>
																										{( typeof(e) == 'object' ) ? 
																											<ListItem bottomDivider containerStyle={{backgroundColor: '#94b242' ,paddingVertical: 3,paddingLeft: 5,paddingRight: 5}}>
																												<Text style={styles.riceName}>{e.form_rel.form_name}</Text>
																												<ListItem.Content>
																													<ListItem.Title style={styles.cardtitle, (e.up_down == 'stable') ? styles.stable : (e.up_down == 'up') ? styles.up : styles.down }>Rs { e.min_price }-{e.max_price}</ListItem.Title>
																												</ListItem.Content>
																											</ListItem>
																										: null}
																									</View>
																								)	
																							})
																						)
																					})}
																				</View>
																			</View>
																		)
																	})
																)
															})}
														</View>
													)
												})
										: <Text></Text> 
									: <Text></Text> 
								: <Text></Text>}
							</View>
						</View>
					: null 
				: null }
			</ScrollView>
			
		</View>
		
	);
}


const styles = {
	container: {
		backgroundColor: '#fefcd6',
		height: '100%'
	},
	stable:{
		color: '#000'
	},
	up:{
		color: '#fefcd6'
	},
	down:{
		color: 'red'
	},
	flex:{
		flex: 1
	},
	activeState : {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: '#94b242',
		marginTop: 10,
		borderRadius: 10,
	},
	state: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
		paddingVertical: 10,
		paddingHorizontal: 20,
		backgroundColor: '#fefcd6',
		borderWidth: 2,
		borderColor: '#94b242',
		marginTop: 10,
		borderRadius: 10,
	},
	displayhorizontal:{
		flexDirection: 'row',
	},
	card: {
		backgroundColor: '#019340',
		margin: 3,
		borderRadius: 5,
		elevation: 7,
		width: 300
	},
	listStyle:{
		padding: 10
	},
	riceName:{
		color : '#000',
		fontSize: 13,
		width: '50%',
		padding: 0,
		margin: 0
	},
	cardtitle:{
		fontSize: 12,
		color : 'white'
	},
	flexDirectionRow:{
		flexDirection: 'row',
		flexWrap: 'wrap'
	}
};
