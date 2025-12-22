import { toast } from 'react-toastify'

export default class NotificationUtils {

  static success(message: string) {
    toast.success(message)
  }

  static error(message: string) {
    toast.error(message)
  }

  static warning(message: string) {
    toast.warning(message)
  }

  static info(message: string) {
    toast.info(message)
  }
}