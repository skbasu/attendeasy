export function getFirstName(fullName) {
    if (!fullName) {
        return 'Stranger';
    } else {
        const nameParts = fullName.trim().split(' ');
        return nameParts[0];
    }
}

export const convertToDate = (timestamp) => {
    if (!timestamp) {
        return '00-00-0000';
    }
    const date = new Date(timestamp);

    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // Months are 0-based
    const day = date.getDate().toString().padStart(2, '0');

    return `${day}-${month}-${year}`;
}

export const getInitialsAndTitle = (name, gender) => {

    if (!name || !gender) {
        return 'Teacher Name';
    }

    const nameParts = name.split(' ');

    const initials = nameParts.map(part => part[0].toUpperCase()).join('');

    let title;
    if (gender.toLowerCase() === 'male') {
        title = 'Sir';
    } else {
        title = "Ma'am";
    }

    return `${initials} ${title}`;
}

export const calculateTimeAgo = (modifiedTime) => {
    const currentTime = new Date();
    const timeDiffInSeconds = Math.floor((currentTime - modifiedTime) / 1000);

    let interval = Math.floor(timeDiffInSeconds / (3600 * 24 * 30));
    if (interval >= 1) {
        return `${interval} month${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(timeDiffInSeconds / (3600 * 24));
    if (interval >= 1) {
        return `${interval} day${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(timeDiffInSeconds / 3600);
    if (interval >= 1) {
        return `${interval} hour${interval === 1 ? '' : 's'} ago`;
    }

    interval = Math.floor(timeDiffInSeconds / 60);
    if (interval >= 1) {
        return `${interval} minute${interval === 1 ? '' : 's'} ago`;
    }

    return `${timeDiffInSeconds} second${timeDiffInSeconds === 1 ? '' : 's'} ago`;
};
