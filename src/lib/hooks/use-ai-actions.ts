// import { useUIState, useAIState } from 'ai/rsc'
// import { useRouter } from 'next/navigation'
// import type { AI } from '@/app/actions'
// import { generateId } from 'ai'
// import { useAppDispatch } from './use-redux'
// import { setAppStateReducer } from '../redux/slices/sliceAppState'

// export function useAIActions() {
//   const [, setMessages] = useUIState<typeof AI>()
//   const [, setAIState] = useAIState<typeof AI>()
//   const router = useRouter()
//   const dispatch = useAppDispatch()

//   const clearMessages = () => {
//     const newId = generateId()
//     dispatch(setAppStateReducer({ isGenerating: false }))
//     setMessages([])
//     setAIState({ messages: [], chatId: newId })
//     window.history.replaceState({}, '', `/search`)
//     router.push(`/search?id=${newId}`)
//     router.refresh()
//   }

//   return { clearMessages }
// }
