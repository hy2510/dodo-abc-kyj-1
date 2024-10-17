'use client'

import useAccountInfoLoading from '@/app/[locale]/(site)/library/_mode/useAccountInfoLoading'
import { updateAccount } from '@/app/_account/account-list'
import { useCustomerInfo } from '@/app/_context/CustomerContext'
import { useRouter } from 'next/navigation'
import { ReactNode, useEffect, useState } from 'react'
import { useStudentAvatar } from '@/client/store/student/avatar/selector'
import { useUpdateStudentLogOn } from '@/client/store/student/info/hook'
import { useStudentInfo } from '@/client/store/student/info/selector'
import LoadingScreen from '@/ui/modules/LoadingScreen'

export default function LoginForward({
  to,
  error,
}: {
  to?: string
  error?: ReactNode
}) {
  const router = useRouter()
  const state = useAccountInfoLoading()
  const [ready, setReady] = useState(false)

  const onUpdateLogOn = useUpdateStudentLogOn()
  const { customerId, name: customerName } = useCustomerInfo()
  const { loginId, studentId, name: studentName } = useStudentInfo()
  const { userAvatar } = useStudentAvatar()
  const avatarImage = userAvatar.imageLarge

  useEffect(() => {
    if (!state.isLoading && loginId && customerId) {
      updateAccount({
        loginId: loginId,
        customerId: customerId,
        customerName: customerName,
        studentId: studentId,
        studentName: studentName,
        avatar: avatarImage,
      })
      setReady(true)
    }
  }, [
    state.isLoading,
    loginId,
    customerId,
    customerName,
    studentId,
    studentName,
    avatarImage,
  ])

  useEffect(() => {
    if (!state.isLoading && ready && to) {
      onUpdateLogOn()
      router.replace(to)
    }
  }, [router, ready, state.isLoading, to, onUpdateLogOn])

  if (state.isError) {
    return <>{error}</>
  }
  if (state.isLoading) {
    return <LoadingScreen />
  }
  return <></>
}