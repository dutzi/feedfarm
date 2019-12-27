export default function sendMessage({ message, imageUrl, targetUid, sourceUid, }: {
    message?: string;
    imageUrl?: string;
    targetUid: string;
    sourceUid: string;
}): Promise<void>;
