
import { useState } from 'react'
import {
  issueStock,
  createStockAdjustment,
  type IssueStockData,
  type CreateStockAdjustmentData,
} from '../services/stockMovements'

export const useStockActions = () => {
  const [issuing, setIssuing] = useState(false)
  const [adjusting, setAdjusting] = useState(false)

  const submitStockIssue = async (data: IssueStockData) => {
    try {
      setIssuing(true)
      await issueStock(data)
      return true
    } finally {
      setIssuing(false)
    }
  }

  const submitStockAdjustment = async (
    data: CreateStockAdjustmentData
  ) => {
    try {
      setAdjusting(true)
      await createStockAdjustment(data)
      return true
    } finally {
      setAdjusting(false)
    }
  }

  return {
    issuing,
    adjusting,
    submitStockIssue,
    submitStockAdjustment,
  }
}
