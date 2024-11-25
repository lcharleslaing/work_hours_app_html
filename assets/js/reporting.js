export async function generateReport(startDate, endDate) {
    // Will be implemented with Firebase
}

export async function exportToCSV(tasks) {
    const headers = ['Description', 'Start Time', 'End Time', 'Location'];
    const csvContent = [
        headers.join(','),
        ...tasks.map(task => [
            task.description,
            task.startTime,
            task.endTime,
            task.location
        ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tasks-${new Date().toISOString()}.csv`;
    a.click();
}

export async function sendToDiscord(webhookUrl, content) {
    try {
        await fetch(webhookUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ content })
        });
    } catch (error) {
        console.error('Error sending to Discord:', error);
        throw error;
    }
} 