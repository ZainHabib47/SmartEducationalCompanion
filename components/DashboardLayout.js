import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useRef, useState } from 'react';
import { Animated, Dimensions, Linking, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const COLORS = {
	bg: '#F5F5F5',
	heading: '#1A2F23',
	inputBg: '#2E4D3A',
	inputText: '#FFFFFF',
	arrow: '#7A9B77',
	link: '#7A9B77',
	buttonBg: '#2E4D3A',
	buttonText: '#FFFFFF',
};

export default function DashboardLayout({
	headerWelcome = 'Welcome Back!',
	name = '',
	email = '',
	extraTopInfo = '',
	showNews = false,
	newsTitle = 'Educational News',
	newsData = [], // [{ id, title, url, source, publishedAt }]
	onPressCard,
	gridItems = [], // [{ key, icon, label }]
	bottomIcons = [], // [{ key, icon, onPress }]
}) {
	const [currentNewsIndex, setCurrentNewsIndex] = useState(0);
	const slideAnim = useRef(new Animated.Value(-100)).current;
	const fadeAnim = useRef(new Animated.Value(0)).current;
	const avatarScale = useRef(new Animated.Value(0)).current;
	const cardSlideAnim = useRef(new Animated.Value(100)).current;
	const cardFadeAnim = useRef(new Animated.Value(0)).current;
	const bottomSlideAnim = useRef(new Animated.Value(100)).current;
	const bottomFadeAnim = useRef(new Animated.Value(0)).current;
	const newsFadeAnim = useRef(new Animated.Value(1)).current;
	const newsTranslateY = useRef(new Animated.Value(0)).current;

	useEffect(() => {
		// Top section animations
		Animated.parallel([
			Animated.timing(slideAnim, {
				toValue: 0,
				duration: 800,
				useNativeDriver: true,
			}),
			Animated.timing(fadeAnim, {
				toValue: 1,
				duration: 1000,
				useNativeDriver: true,
			}),
			Animated.spring(avatarScale, {
				toValue: 1,
				tension: 50,
				friction: 7,
				useNativeDriver: true,
			}),
		]).start();

		// Cards slide in animation (delayed)
		setTimeout(() => {
			Animated.parallel([
				Animated.timing(cardSlideAnim, {
					toValue: 0,
					duration: 600,
					useNativeDriver: true,
				}),
				Animated.timing(cardFadeAnim, {
					toValue: 1,
					duration: 600,
					useNativeDriver: true,
				}),
			]).start();
		}, 400);

		// Bottom section slide up animation (delayed)
		setTimeout(() => {
			Animated.parallel([
				Animated.timing(bottomSlideAnim, {
					toValue: 0,
					duration: 700,
					useNativeDriver: true,
				}),
				Animated.timing(bottomFadeAnim, {
					toValue: 1,
					duration: 700,
					useNativeDriver: true,
				}),
			]).start();
		}, 600);
	}, []);

	// Auto-rotate news every 10 seconds with animation
	useEffect(() => {
		if (!showNews || !newsData || newsData.length === 0) return;

		const animateOutIn = () => {
			Animated.parallel([
				Animated.timing(newsFadeAnim, { toValue: 0, duration: 300, useNativeDriver: true }),
				Animated.timing(newsTranslateY, { toValue: 10, duration: 300, useNativeDriver: true }),
			]).start(() => {
				setCurrentNewsIndex((prev) => (prev + 1) % newsData.length);
				newsTranslateY.setValue(-10);
				Animated.parallel([
					Animated.timing(newsFadeAnim, { toValue: 1, duration: 350, useNativeDriver: true }),
					Animated.spring(newsTranslateY, { toValue: 0, useNativeDriver: true, friction: 7, tension: 60 }),
				]).start();
			});
		};

		const intervalId = setInterval(animateOutIn, 10000);
		return () => clearInterval(intervalId);
	}, [showNews, newsData]);

	const handleNewsPress = async (url) => {
		try {
			const supported = await Linking.canOpenURL(url);
			if (supported) {
				await Linking.openURL(url);
			}
		} catch (error) {
			console.log('Error opening URL:', error);
		}
	};

	return (
		<View style={styles.container}>
			<Animated.View 
				style={[
					styles.topSection,
					{
						transform: [{ translateY: slideAnim }],
						opacity: fadeAnim,
					}
				]}
			>
				<View style={styles.topRow}>
					<View style={styles.textContainer}>
						<Text style={styles.welcome}>{headerWelcome}</Text>
						{!!name && <Text style={styles.name}>{name}</Text>}
						{!!email && <Text style={styles.topInfo}>{email}</Text>}
						{!!extraTopInfo && <Text style={styles.topInfo}>{extraTopInfo}</Text>}
					</View>
					<Animated.View 
						style={[
							styles.avatar,
							{
								transform: [{ scale: avatarScale }],
							}
						]}
					>
						<View style={styles.avatarInner} />
					</Animated.View>
				</View>
				<View style={styles.decorativeLine} />
			</Animated.View>
			<View style={styles.middleSection}>
				{showNews && (
					<View style={styles.newsCard}>
						{/* Title Section - 10% of the box height */}
						<View style={styles.newsHeader}>
							<Ionicons name="newspaper" size={24} color={COLORS.inputBg} />
							<Text style={styles.newsTitle}>{newsTitle}</Text>
						</View>
						
						{/* News Content Section - 90% of the box height */}
						<View style={styles.newsContent}>
							{newsData.length > 0 ? (
								<Animated.View
									style={{
										opacity: newsFadeAnim,
										transform: [{ translateY: newsTranslateY }],
										flex: 1,
									}}
								>
									{(() => {
										const news = newsData[currentNewsIndex % newsData.length];
										return (
											<TouchableOpacity
												key={news.id || currentNewsIndex}
												style={styles.newsItem}
												onPress={() => handleNewsPress(news.url)}
												activeOpacity={0.8}
											>
												<ScrollView 
													style={styles.newsScrollView}
													showsVerticalScrollIndicator={false}
													contentContainerStyle={styles.newsScrollContent}
												>
													<Text style={styles.newsItemTitle}>
														{news.title}
													</Text>
													<View style={styles.newsItemFooter}>
														<Text style={styles.newsSource}>{news.source}</Text>
														<Text style={styles.newsDate}>{news.publishedAt}</Text>
													</View>
													<Text style={styles.newsLink}>
														Read more ↗
													</Text>
												</ScrollView>
											</TouchableOpacity>
										);
									})()}
								</Animated.View>
							) : (
								<View style={styles.newsPlaceholder}>
									<Text style={styles.newsPlaceholderText}>Loading educational news...</Text>
								</View>
							)}
						</View>
					</View>
				)}
				<View style={styles.grid}>
					{gridItems.map((item) => (
						<TouchableOpacity
							key={item.key}
							style={styles.card}
							activeOpacity={0.85}
							onPress={() => onPressCard && onPressCard(item.key)}
						>
							<View style={styles.cardIconContainer}>
								<Ionicons name={item.icon} size={32} color={COLORS.inputBg} />
							</View>
							<Text style={styles.cardText}>{item.label}</Text>
						</TouchableOpacity>
					))}
				</View>
			</View>
			<Animated.View 
				style={[
					styles.bottomSection,
					{
						transform: [{ translateY: bottomSlideAnim }],
						opacity: bottomFadeAnim,
					}
				]}
			>
				<View style={styles.bottomContainer}>
					{bottomIcons.map((bi, index) => (
						<Animated.View
							key={bi.key}
							style={{
								transform: [{
									translateY: bottomSlideAnim.interpolate({
										inputRange: [0, 100],
										outputRange: [0, 50 + (index * 10)],
									})
								}],
								opacity: bottomFadeAnim,
							}}
						>
							<TouchableOpacity 
								key={bi.key} 
								style={styles.bottomIcon} 
								onPress={bi.onPress}
								activeOpacity={0.8}
							>
								<Ionicons name={bi.icon} size={24} color={COLORS.inputBg} />
							</TouchableOpacity>
						</Animated.View>
					))}
				</View>
			</Animated.View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: COLORS.bg,
	},
	topSection: {
		height: height * 0.25,
		backgroundColor: COLORS.inputBg,
		paddingHorizontal: 20,
		paddingTop: Math.max(20, height * 0.03),
		justifyContent: 'center',
		borderBottomLeftRadius: 25,
		borderBottomRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
	},
	topRow: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-between',
		marginBottom: 15,
	},
	textContainer: {
		flex: 1,
		paddingRight: 15,
	},
	welcome: {
		fontFamily: 'Outfit',
		fontSize: 27,
		color: COLORS.buttonText,
		marginBottom: 4,
	},
	name: {
		fontFamily: 'Outfit',
		fontSize: 20,
		color: COLORS.buttonText,
		marginBottom: 2,
	},
	topInfo: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: COLORS.buttonText,
		opacity: 0.9,
	},
	avatar: {
		width: 60,
		height: 60,
		borderRadius: 30,
		backgroundColor: '#DDE8D8',
		justifyContent: 'center',
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},
	avatarInner: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: COLORS.inputBg,
		opacity: 0.1,
	},
	decorativeLine: {
		height: 3,
		backgroundColor: '#DDE8D8',
		borderRadius: 2,
		marginHorizontal: 20,
		opacity: 0.6,
	},
	middleSection: {
		height: height * 0.6,
		backgroundColor: 'transparent',
		padding: 20,
	},
	newsCard: {
		backgroundColor: '#fff',
		borderRadius: 20,
		padding: 20,
		marginBottom: 24,
		height: height * 0.28, // Fixed height for the carousel box
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 6,
		elevation: 4,
	},
	newsHeader: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'center',
		height: height * 0.035, // 10% of the news card height
		marginBottom: 8,
	},
	newsTitle: {
		fontFamily: 'Griffter',
		fontSize: 18,
		color: COLORS.inputBg,
		marginLeft: 8,
		textAlign: 'center',
	},
	newsContent: {
		flex: 1, // Takes remaining 90% of the height
		overflow: 'hidden',
	},
	newsItem: {
		flex: 1,
		backgroundColor: '#F8F9FA',
		borderRadius: 12,
		borderLeftWidth: 4,
		borderLeftColor: COLORS.inputBg,
		overflow: 'hidden',
	},
	newsScrollView: {
		flex: 1,
		paddingHorizontal: 16,
		paddingVertical: 12,
	},
	newsScrollContent: {
		flexGrow: 1,
		justifyContent: 'space-between',
	},
	newsItemTitle: {
		fontFamily: 'Griffter',
		fontSize: 16,
		color: COLORS.inputBg,
		lineHeight: 22,
		marginBottom: 12,
		flex: 1,
	},
	newsItemFooter: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
	},
	newsSource: {
		fontFamily: 'Outfit',
		fontSize: 12,
		color: COLORS.link,
	},
	newsDate: {
		fontFamily: 'Outfit',
		fontSize: 12,
		color: COLORS.link,
	},
	newsLink: {
		marginTop: 8,
		fontFamily: 'Griffter',
		fontSize: 14,
		color: COLORS.link,
		textDecorationLine: 'underline',
		alignSelf: 'flex-start',
	},
	newsPlaceholder: {
		flex: 1,
		borderRadius: 16,
		backgroundColor: '#F5F9F4',
		alignItems: 'center',
		justifyContent: 'center',
		borderWidth: 1,
		borderColor: '#DDE8D8',
		minHeight: height * 0.18,
	},
	newsPlaceholderText: {
		fontFamily: 'Outfit',
		color: COLORS.link,
		fontSize: 16,
	},
	grid: {
		flexDirection: 'row',
		flexWrap: 'wrap',
		justifyContent: 'space-between',
		paddingHorizontal: 0,
	},
	card: {
		width: '48%',
		backgroundColor: '#fff',
		borderWidth: 2,
		borderColor: COLORS.inputBg,
		borderRadius: 20,
		paddingVertical: 20,
		paddingHorizontal: 12,
		marginBottom: 16,
		alignItems: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 3 },
		shadowOpacity: 0.12,
		shadowRadius: 8,
		elevation: 6,
	},
	cardIconContainer: {
		width: 50,
		height: 50,
		borderRadius: 25,
		backgroundColor: '#F0F8F0',
		alignItems: 'center',
		justifyContent: 'center',
		marginBottom: 10,
	},
	cardText: {
		fontFamily: 'Outfit',
		fontSize: 14,
		color: COLORS.inputBg,
		textAlign: 'center',
	},
	bottomSection: {
		height: height * 0.16,
		backgroundColor: COLORS.inputBg,
		width: '100%',
		position: 'absolute',
		bottom: 0,
		left: 0,
		right: 0,
		borderTopLeftRadius: 25,
		borderTopRightRadius: 25,
		shadowColor: '#000',
		shadowOffset: { width: 0, height: -4 },
		shadowOpacity: 0.15,
		shadowRadius: 8,
		elevation: 8,
	},
	bottomContainer: {
		flexDirection: 'row',
		alignItems: 'center',
		justifyContent: 'space-evenly',
		paddingHorizontal: 20,
		paddingTop: 20,
		paddingBottom: 30,
		flex: 1,
	},
	bottomIcon: {
		width: 60,
		height: 60,
		backgroundColor: '#DDE8D8',
		borderRadius: 30,
		alignItems: 'center',
		justifyContent: 'center',
		shadowColor: '#000',
		shadowOffset: { width: 0, height: 2 },
		shadowOpacity: 0.1,
		shadowRadius: 4,
		elevation: 4,
	},
});


