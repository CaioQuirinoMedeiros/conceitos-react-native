import React, { useState, useEffect } from 'react'
import { Alert } from 'react-native'

import api from './services/api'

import {
  SafeAreaView,
  View,
  FlatList,
  Text,
  StatusBar,
  StyleSheet,
  TouchableOpacity
} from 'react-native'

function Repository ({ repository, onLike }) {
  return (
    <View style={styles.repositoryContainer}>
      <Text style={styles.repository}>{repository.title}</Text>

      <View style={styles.techsContainer}>
        {repository.techs.map((tech, index) => (
          <Text key={index} style={styles.tech}>
            {tech}
          </Text>
        ))}
      </View>

      <View style={styles.likesContainer}>
        <Text
          style={styles.likeText}
          testID={`repository-likes-${repository.id}`}
        >
          {`${repository.likes} curtidas`}
        </Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={onLike}
        testID={`like-button-${repository.id}`}
      >
        <Text style={styles.buttonText}>Curtir</Text>
      </TouchableOpacity>
    </View>
  )
}

export default function App () {
  const [repositories, setRepositories] = useState([])

  useEffect(() => {
    async function getRepositories () {
      try {
        const { data } = await api.get('/repositories')

        setRepositories(data)
      } catch (err) {
        Alert.alert(
          'Erro de conexão',
          'Não foi possível buscar os repositórios',
          [{ text: 'Ok' }]
        )
      }
    }

    getRepositories()
  }, [])

  async function handleLikeRepository (id) {
    try {
      await api.post(`/repositories/${id}/like`)

      setRepositories(oldRepos =>
        oldRepos.map(repo =>
          repo.id === id ? { ...repo, likes: repo.likes + 1 } : repo
        )
      )
    } catch (err) {
      Alert.alert('Erro de conexã', 'Não possível processar o like', [
        { text: 'Ok' }
      ])
    }
  }

  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor='#7159c1' />
      <SafeAreaView style={styles.container}>
        <FlatList
          data={repositories}
          keyExtractor={repo => repo.id}
          renderItem={({ item: repo }) => (
            <Repository
              repository={repo}
              onLike={() => handleLikeRepository(repo.id)}
            />
          )}
        />
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#7159c1'
  },
  repositoryContainer: {
    marginBottom: 15,
    marginHorizontal: 15,
    backgroundColor: '#fff',
    padding: 20
  },
  repository: {
    fontSize: 32,
    fontWeight: 'bold'
  },
  techsContainer: {
    flexDirection: 'row',
    marginTop: 10
  },
  tech: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
    backgroundColor: '#04d361',
    paddingHorizontal: 10,
    paddingVertical: 5,
    color: '#fff'
  },
  likesContainer: {
    marginTop: 15,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  likeText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10
  },
  button: {
    marginTop: 10
  },
  buttonText: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 10,
    color: '#fff',
    backgroundColor: '#7159c1',
    padding: 15
  }
})
