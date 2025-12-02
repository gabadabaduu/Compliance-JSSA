import './LoadingSpinner.css';

interface LoadingSpinnerProps {
    size?: 'small' | 'medium' | 'large';
    text?: string;
}

export default function LoadingSpinner({ size = 'medium', text }: LoadingSpinnerProps) {
    return (
        <div className="loading-spinner-container">
            <div className={`loading-spinner ${size}`}></div>
            {text && <p>{text}</p>}
        </div>
    );
}
