import './SuccessMessage.css';

interface SuccessMessageProps {
    message: string;
}

export default function SuccessMessage({ message }: SuccessMessageProps) {
    return (
        <div className="success-message">
            <strong>Éxito!</strong> {message}
        </div>
    );
}