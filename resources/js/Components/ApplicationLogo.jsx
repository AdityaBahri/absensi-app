export default function ApplicationLogo({ className = '', ...props }) {
    return (
        <img
            {...props}
            src="/Logo.png"
            alt="Logo"
            className={`object-contain ${className}`}
        />
    );
}
