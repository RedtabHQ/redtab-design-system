import { ToneSelector } from "@/components/ToneSelector";
import { Contract, Merchant } from "@/types";
import { useQuery } from "@tanstack/react-query";
import { getCollectionDraft } from '@/lib/geminiService';
import { useState } from "react";
import { MessageSquare, RotateCcw, Send, Sparkles, X } from "lucide-react";
import { useToast } from "@/hooks/useToast";
import { useSendCommunication } from "@/features/communication/hooks/useCommunication";

interface AIDraftToneProps {
    contract: Contract;
    isOpen: boolean;
    setIsOpen: (open: boolean) => void;
}

const AIDraftTone = ({ contract, isOpen, setIsOpen }: AIDraftToneProps) => {
    const [draftTone, setDraftTone] = useState<'SUPPORTIVE' | 'FORMAL' | 'URGENT'>('SUPPORTIVE');

    const {
        refetch: refetchDraft,
        isFetching: isDrafting,
    } = useQuery({
        queryKey: ['collection-draft', contract.merchantId, contract?.id, draftTone],
        queryFn: () => getCollectionDraft(contract.merchantId, contract, draftTone),
        enabled: false,
        initialData: '',
    });

    const [draftMessage, setDraftMessage] = useState('');

    const { show: showToast } = useToast();
    const { mutateAsync: sendCommunication, isPending: isSending } = useSendCommunication();

    const handleAIDraft = async () => {
        try {
            const { data } = await refetchDraft();
            setDraftMessage(data || '');
        } catch (error) {
            console.error('Failed to generate draft:', error);
            showToast({
                type: 'DANGER',
                title: 'Draft Failed',
                message: 'AI failed to generate a draft message. Please try again.'
            });
        }

    };

    const handleSendComm = async (channel: 'WHATSAPP' | 'EMAIL') => {
        if (!contract.merchantId) return;

        try {
            await sendCommunication({
                recipientId: contract.merchantId,
                recipientType: 'MERCHANT',
                channel,
                type: 'COLLECTION_NOTICE',
                message: draftMessage,
                metadata: { tone: draftTone, contractId: contract.id }
            });

            setDraftMessage('');
            setIsOpen(false);
            showToast({
                type: 'SUCCESS',
                title: 'Notification Sent',
                message: `${channel} notification sent successfully.`
            });
        } catch (error) {
            console.error('Failed to send communication:', error);
            showToast({
                type: 'DANGER',
                title: 'Send Failed',
                message: `Failed to send ${channel} notification. Please try again.`
            });
        }
    };

    return (
        <>
            {isOpen && (
                <>
                    <div className="fixed inset-0 bg-gray-900/40 backdrop-blur-sm z-[100] animate-in fade-in duration-300" onClick={() => setIsOpen(false)} />
                    <div className="fixed top-0 right-0 h-full w-full max-w-md bg-white shadow-2xl z-[110] animate-in slide-in-from-right duration-500 flex flex-col rounded-l-[3rem] overflow-hidden">
                        <div className="p-8 border-b border-gray-50 bg-gray-50/50 flex justify-between items-center">
                            <div className="flex items-center gap-3">
                                <div className="p-2.5 bg-red-600 text-white rounded-2xl shadow-lg shadow-red-200"><Sparkles size={20} /></div>
                                <div>
                                    <h3 className="text-xl font-black text-gray-900 tracking-tight">Recovery Assistant</h3>
                                    <p className="text-2xs font-black text-gray-400 uppercase tracking-widest">AI Drafting in {contract.currency?.code || contract.marketSegment?.currency || 'NPR'}</p>
                                </div>
                            </div>
                            <button onClick={() => setIsOpen(false)} className="p-3 text-gray-400 hover:text-gray-900 hover:bg-white rounded-2xl transition-all"><X size={20} /></button>
                        </div>
                        <div className="flex-1 overflow-y-auto p-8 space-y-8">
                            <ToneSelector value={draftTone} onChange={setDraftTone} />
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <label className="text-2xs font-black text-gray-400 uppercase tracking-widest">Generated Message</label>
                                    <button onClick={handleAIDraft} disabled={isDrafting} className="flex items-center gap-1.5 text-2xs font-black text-redtab hover:underline uppercase tracking-widest">
                                        <RotateCcw size={12} className={isDrafting ? 'animate-spin' : ''} /> {isDrafting ? 'Drafting...' : 'Regenerate Draft'}
                                    </button>
                                </div>
                                <textarea className="w-full h-48 p-5 bg-gray-50 border border-gray-100 rounded-lg text-sm font-medium leading-relaxed resize-none focus:ring-1 focus:ring-redtab outline-none transition-all shadow-inner" placeholder="AI will draft a personalized message here..." value={draftMessage} onChange={(e) => setDraftMessage(e.target.value)} />
                            </div>
                        </div>
                        <div className="p-8 border-t border-gray-50 bg-gray-50/20 flex gap-3">
                            <button onClick={() => handleSendComm('WHATSAPP')} disabled={!draftMessage || isSending} className="flex-1 py-4 bg-green-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-green-700 transition-all flex items-center justify-center gap-2 disabled:bg-gray-200"><Send size={16} /> {isSending ? 'Sending...' : 'WhatsApp'}</button>
                            <button onClick={() => handleSendComm('EMAIL')} disabled={!draftMessage || isSending} className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all flex items-center justify-center gap-2 disabled:bg-gray-200"><MessageSquare size={16} /> {isSending ? 'Sending...' : 'Email'}</button>
                        </div>
                    </div>
                </>
            )}
        </>
    );

}

export default AIDraftTone;