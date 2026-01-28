import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { apolloClient } from '@/apollo'
import gql from 'graphql-tag'
import type { User, AuthResponse } from '@/types'

const LOGIN_MUTATION = gql`
  mutation Login($input: LoginInput!) {
    login(input: $input) {
      accessToken
      user {
        id
        email
        name
        avatar
        role
        createdAt
      }
    }
  }
`

const REGISTER_MUTATION = gql`
  mutation Register($input: RegisterInput!) {
    register(input: $input) {
      accessToken
      user {
        id
        email
        name
        avatar
        role
        createdAt
      }
    }
  }
`

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  const login = async (email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: LOGIN_MUTATION,
        variables: {
          input: { email, password }
        }
      })

      const authResponse: AuthResponse = data.login
      token.value = authResponse.accessToken
      user.value = authResponse.user
      localStorage.setItem('token', authResponse.accessToken)
      localStorage.setItem('user', JSON.stringify(authResponse.user))

      return authResponse
    } catch (error) {
      console.error('Login error:', error)
      throw error
    }
  }

  const register = async (name: string, email: string, password: string) => {
    try {
      const { data } = await apolloClient.mutate({
        mutation: REGISTER_MUTATION,
        variables: {
          input: { name, email, password }
        }
      })

      const authResponse: AuthResponse = data.register
      token.value = authResponse.accessToken
      user.value = authResponse.user
      localStorage.setItem('token', authResponse.accessToken)
      localStorage.setItem('user', JSON.stringify(authResponse.user))

      return authResponse
    } catch (error) {
      console.error('Register error:', error)
      throw error
    }
  }

  const logout = () => {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    apolloClient.clearStore()
  }

  const initAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser && token.value) {
      user.value = JSON.parse(storedUser)
    }
  }

  return {
    user,
    token,
    isAuthenticated,
    login,
    register,
    logout,
    initAuth,
  }
})