import React, {useRef ,useState, useEffect} from 'react';
import { AsyncStorage, Dimensions } from 'react-native';
import { Pressable } from 'react-native';
import {Button,Image,StyleSheet,Text,View,FlatList,Item,ScrollView,} from 'react-native';
import {ListItem, Avatar} from 'react-native-elements';

export default function Basmati() {
	const windowWidth = Dimensions.get('window').width;
	const windowHeight = Dimensions.get('window').height;

	const [isLoading, setLoading] = useState(true);
	const [HasBasmatiContent, setHasBasmatiContent] = useState(false);
	const [HasNonBasmatiContent, setHasNonBasmatiContent] = useState(false);

	const [data, setData] = useState([]);
	const [basmati, setBasmatiData] = useState([]);
	const [nonbasmati, setNonbasmatiData] = useState([]);
	const [selectedState, setSelectedState] = useState([]);
	const [transportData, setTransportData] = useState();
	const [hasTransport, setHasTransport] = useState(false);

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
			ApiData.push('TRANSPORT');
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
		if( state != 'TRANSPORT' ){
			fetch('https://snjtradelink.com/admin/public/api/get/all/basmati/'+state)
			.then((response) => response.json())
			.then((json) => {setBasmatiData(json.prices.basmati)  , setHasTransport(false) })
			.catch((error) => {console.error(error)})
			.finally(() => {setHasBasmatiContent(true)  , setHasTransport(false)});
	
			fetch('https://snjtradelink.com/admin/public/api/get/all/nonbasmati/'+state)
			.then((response) => response.json())
			.then((json) => setNonbasmatiData(json.prices.non_basmati) )
			.catch((error) => console.error(error))
			.finally(() => setHasNonBasmatiContent(true) , setHasTransport(false));	
		}else{
			// setTransportData(json)
			fetch('https://snjtradelink.com/admin/public/api/get/ports')
			.then((response) => response.json())
			.then((json) => {setTransportData(json.data), console.log(json.data) } )
			.catch((error) => {console.error(error)})
			.finally(() => {setHasTransport(true)});
		}

	}
	
	return (
		<View style={styles.container}>
			<View style={{flex: 7,paddingHorizontal: 10}}>
				<View >
					<ScrollView horizontal={true} ref={scrollRef}>
						<View style={[styles.displayhorizontal , styles.listStyle]}>
							{ (isLoading === true)  ? <Text>Loading...</Text> : 
								( Object.values(data).length > 0) ? 
									Object.values(data).map((m , k) => {
										return(
											(m == 'TRANSPORT')?
												<Pressable key={m} style={styles.Transportstate} onPress={() => { getStateData(m) }}>
													<Text key={m}>{m}</Text>
												</Pressable>
											:
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
				<View style={{flex: 8}}>
					{(!hasTransport)? 
						<ScrollView vertical={true}> 
							{(basmati != undefined) ? 
								(basmati.length > 0) ? 
									<View>
										<View style={{ }} >
											<Text style={{color: '#000', fontSize: 22,marginTop: 1,marginLeft: 10,marginBottom: 1,padding: 0,margin: 0,textAlign: 'center'}}>
												Basmati live price (Prices in quintals)
											</Text>
										</View>
										<View style={styles.flexDirectionRow}>
											{( HasBasmatiContent ) ? 
												(basmati != undefined) ?
													(basmati.length > 0)  ? 
														Object.values(basmati).map(( m , k) => { 
															return(
																<View style={{marginTop: 10, borderColor: '#94b242', borderWidth: 2.5,marginHorizontal: 4,padding: 2,borderRadius: 10,width: '24%'}}>
																	<Text style={{fontSize: 16,textAlign: 'center',fontWeight: '700'}}> {Object.keys(m)}</Text> 
																	{Object.values(m).map(( n , i) => {
																		return(
																			Object.values(n).map(( a , b) => { 
																				return(
																					<View key={b} >
																						<View style={styles.card}>
																							{Object.values(a).map((c ,d) => {
																								return(
																									Object.values(c).map((e ,f) => {	
																										return(
																											<View>
																											{( typeof(e) == 'object' ) ? 
																												<ListItem bottomDivider containerStyle={{backgroundColor: 'transparent' ,paddingVertical: 3,paddingLeft: 5,paddingRight: 5}}>
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
											<Text style={{color: '#000', fontSize: 22,marginTop: 25,marginLeft: 10,marginBottom: 5,textAlign: 'center'}}>
												Non-Basmati live price (Prices in quintals)
											</Text>
										</View>
										<View style={styles.flexDirectionRow}>
											{( HasNonBasmatiContent ) ? 
												(nonbasmati != undefined)  ? 
													(nonbasmati.length > 0)  ? 
														Object.values(nonbasmati).map(( m , k) => { 
																return(
																	<View style={{marginTop: 10, borderColor: '#94b242', borderWidth: 2.5,marginHorizontal: 5,padding: 5,borderRadius: 10,height: 'auto',width: '24%'}}>
																		<Text style={{fontSize: 16,textAlign: 'center',fontWeight: '700'}}> {Object.keys(m)} </Text> 
																		{Object.values(m).map(( n , i) => { 
																			return(
																				Object.values(n).map(( a , b) => { 
																					return(
																						<View key={b} >
																							<View style={styles.card}>
																								{Object.values(a).map((c ,d) => {
																									return(
																										Object.values(c).map((e ,f) => {	
																											return(
																												<View>
																													{( typeof(e) == 'object' ) ? 
																														<ListItem bottomDivider containerStyle={{backgroundColor: '#fefcd6' ,paddingVertical: 3,paddingLeft: 5,paddingRight: 5}}>
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
					:
						<ScrollView>
							{(transportData != undefined) ? 
								(Object.values(transportData).length > 0) ? 
									<View>
										<View >
											<Text style={{color: '#000', fontSize: 22,marginTop: 5,marginLeft: 10,marginBottom: 5,alignItems:'center',textAlign:'center'}}>
												Transport(Prices in quintals 30-35 MT)
											</Text>
										</View>
										<View style={styles.flexDirectionRow}>
											{( hasTransport ) ?
												(transportData != undefined) ?
													(Object.values(transportData).length > 0)  ? 
														Object.values(transportData).map(( m , k) => { 
															return(
																<View key={k} style={{marginTop: 10, borderColor: '#94b242', borderWidth: 2.5,marginHorizontal: 5,padding: 5,borderRadius: 10,width: '24%'}}>
																	<View key={k}>
																		<Text key={k} style={{fontWeight: '700',fontSize: 16,textAlign: 'center'}}>{(Object.keys(transportData)[k]).replace('_', ' ')}</Text>
																	</View>
																	{Object.keys(m).map((val , key) => {
																		return(
																			<ListItem bottomDivider containerStyle={{backgroundColor: 'transparent' ,paddingVertical: 3,paddingLeft: 5,paddingRight: 5}}>
																				<Text style={styles.riceName}>{val.replace('_' , ' ')}</Text>
																				<ListItem.Content>
																					<ListItem.Title style={{ }}>Rs {Object.values(m)[key][0].price}</ListItem.Title>
																				</ListItem.Content>
																			</ListItem>
																		)
																	})}
																	{/* <Text> {transportData[k]}</Text>  */}
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
					}
					
				</View>
			</View>
		
			
			<View style={{flex: 0.5,backgroundColor: '#94b242',justifyContent: 'space-evenly',flexDirection: 'row',paddingLeft: 20}}>
				<View>
					<View style={{width: '80%',flexDirection: 'row'}}>
						<View style={{}}>
							<Text style={{fontSize: 16,color: '#fefcd6'}}>For Brand Marketing & Bulk Rice Sourcing:  </Text>
						</View>
						<View>
							<Text style={{fontSize: 17,color: '#fefcd6'}}>+91-98993-30123, </Text>
						</View>
						<View>
							<Text style={{fontSize: 17,color: '#fefcd6'}}>info@sntcgroup.com, </Text>
						</View>
						<View>
							<Text style={{fontSize: 17,color: '#fefcd6'}}>https://www.sntcgroup.com </Text>
						</View>
					</View>
					<View style={{width: '80%',flexDirection: 'row'}}>
						<View style={{}}>
							<Text style={{fontSize: 13,color: '#fefcd6'}}>* Above mentioned information is just a market update not an offer:  </Text>
						</View>
					</View>
				</View>
				<View style={{width: '20%'}}>
					<Image source={require('./images/icon.png')} style={{width: 70 , height: 70,position: 'absolute',zIndex: 99999, bottom: 0,right: 0}} />
				</View>
			</View>
		</View>
	);
}


const styles = {
	container: {
		backgroundColor: '#fefcd6',
		height: '100%',
		width: '100%',
	
	},
	stable:{
		color: '#000',
		fontSize: 13,
	},
	up:{
		color: '#94b242',
		fontSize: 13,
	},
	down:{
		color: 'red',
		fontSize: 13,
	},
	flex:{
		flex: 1
	},
	activeState : {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: '#94b242',
		marginTop: 10,
		borderRadius: 10,
	},
	state: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: '#fefcd6',
		borderWidth: 2,
		borderColor: '#94b242',
		marginTop: 10,
		borderRadius: 10,
	},
	Transportstate: {
		color: '#fff',
		fontSize: 16,
		marginLeft: 10,
		paddingVertical: 5,
		paddingHorizontal: 10,
		backgroundColor: 'orange',
		borderWidth: 2,
		borderColor: 'orange',
		marginTop: 10,
		borderRadius: 10,
	},
	displayhorizontal:{
		flexDirection: 'row',
	},
	card: {
		backgroundColor: '#fefcd6',
		margin: 3,
		borderRadius: 5,
		// elevation: 7,
		// width: 300,
		height: 'auto'
	},
	listStyle:{
		padding: 10,
		paddingLeft: 0
	},
	riceName:{
		color : '#000',
		fontSize: 13,
		width: '50%',
		padding: 0,
		margin: 0,
	},
	cardtitle:{
		fontSize: 12,
		color : 'white'
	},
	flexDirectionRow:{
		flexDirection: 'row',
		flexWrap: 'wrap',
	}
};
