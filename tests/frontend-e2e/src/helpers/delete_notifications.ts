import { Page, expect } from "@playwright/test";

export async function delete_notifications(page: Page) {
    await page.getByText('Notifications', { exact: true }).click();
    
    const notificationsList = page.locator('app-notifications-list');
    const isUpToDate = await notificationsList.textContent().then(text => 
      text?.includes('You are up to date')
    );
    
    if (!isUpToDate) {
      await page.getByRole('button', { name: 'Mark all as read' }).click();
      
      await expect(notificationsList).toContainText('You are up to date');
    }
  }