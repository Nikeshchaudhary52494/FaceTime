function UserInfo({ userId }) {
    return (
        <div className="text-center mb-4">
            <p>
                <strong>Your User ID:</strong> {userId}
            </p>
            <p className="text-sm text-gray-500">
                Share this ID with someone to receive a call.
            </p>
        </div>
    );
}

export default UserInfo;
