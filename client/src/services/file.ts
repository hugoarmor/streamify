export class FileService {
  static getFileSize(size: number) {
    const units = ["B", "KB", "MB", "GB", "TB"];
    let unitIndex = 0;

    while (size >= 1000 && unitIndex < units.length - 1) {
      size /= 1000;
      unitIndex++;
    }

    const fixedSize = size % 1 === 0 ? size : size.toFixed(2);

    return `${fixedSize} ${units[unitIndex]}`;
  }

  static downloadFile(url: string) {
    const link = document.createElement("a");
    link.setAttribute('href', url);
    link.setAttribute("download", "download");
    document.body.appendChild(link);
    link.click();
  }
}
