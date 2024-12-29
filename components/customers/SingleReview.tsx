import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Colors from '@/constants/Colors';

interface SingleReviewProps {
    message: string;
    rating: number;
}

export default function SingleReview({message, rating}: SingleReviewProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.rating}>{rating}{' '}✨</Text>
      <Text style={styles.message}>{message}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
    container: {
        maxWidth: 250,
        backgroundColor: Colors.background,
        borderRadius: 10,
        marginRight: 10,
        padding: 9,
        overflow: 'hidden'
    },
    message: {
        fontSize: 15,
        fontFamily: 'park-r',
        color: Colors.white300
    },
    rating: {
      textAlign: 'center',
      color: Colors.orange100,
      fontSize: 19,
      fontFamily: 'park-m'
    }
});