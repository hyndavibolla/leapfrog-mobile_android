export class AppService {
  private deviceId: string;
  private getDeviceId: () => Promise<string>;

  constructor(getDeviceId: () => Promise<string>) {
    this.getDeviceId = getDeviceId;
  }

  getDeviceIdAsync = async () => this.deviceId || (await this.getDeviceId());
}
