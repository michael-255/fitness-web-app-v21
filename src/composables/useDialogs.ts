import DialogConfirm from '@/components/dialogs/DialogConfirm.vue'
import DialogConfirmStrict from '@/components/dialogs/DialogConfirmStrict.vue'
import DialogDismiss from '@/components/dialogs/DialogDismiss.vue'
import { useQuasar } from 'quasar'
import type { Component } from 'vue'

export default function useDialogs() {
    const $q = useQuasar()

    /**
     * Helper function that dislays the dialog with the provided component and props.
     */
    function showDialog({
        component,
        onOk,
        onCancel,
        onDismiss,
        ...props
    }: {
        component: Component
        onOk?: () => Promise<void>
        onCancel?: () => Promise<void>
        onDismiss?: () => Promise<void>
        [key: string]: any
    }) {
        $q.dialog({
            component,
            componentProps: {
                ...props,
            },
        })
            .onOk(async () => {
                if (onOk) await onOk()
            })
            .onCancel(async () => {
                if (onCancel) await onCancel()
            })
            .onDismiss(async () => {
                if (onDismiss) await onDismiss()
            })
    }

    /**
     * Displays a dismissable dialog with the provided props.
     */
    function onDismissDialog({
        title,
        message,
        icon,
        color,
    }: {
        title: string
        message: string
        icon: string
        color: string
    }) {
        showDialog({ component: DialogDismiss, title, message, icon, color })
    }

    /**
     * Displays a confirmation dialog with the provided props.
     */
    function onConfirmDialog({
        title,
        message,
        icon,
        color,
        onOk,
    }: {
        title: string
        message: string
        icon: string
        color: string
        onOk: () => Promise<void>
    }) {
        showDialog({
            component: DialogConfirm,
            title,
            message,
            icon,
            color,
            onOk,
        })
    }

    /**
     * Displays a strict confirmation dialog that requires a specific confirmation code to close.
     */
    function onStrictConfirmDialog({
        title,
        message,
        icon,
        color,
        confirmationText = 'YES',
        onOk,
    }: {
        title: string
        message: string
        icon: string
        color: string
        confirmationText?: string
        onOk: () => Promise<void>
    }) {
        showDialog({
            component: DialogConfirmStrict,
            title,
            message,
            icon,
            color,
            confirmationText,
            onOk,
        })
    }

    return {
        showDialog,
        onDismissDialog,
        onConfirmDialog,
        onStrictConfirmDialog,
    }
}
