using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.DeepZoomTools;
using System.IO;
using System.Threading;
using System.Drawing;
using System.Windows.Media.Imaging;

namespace ImageManipulationLib
{
    public class ImageManipulator
    {
       
        /// <summary>
        /// Convenience Method.
        /// </summary>
        /// <param name="imagePath"></param>
        /// <returns></returns>
        public static string createDeepZoomImage(string imagePath, string directoryPath = "C:\\TAG\\")
        {
            string imageName = Path.GetFileName(imagePath);
            return createDeepZoomImage(imageName, imagePath, directoryPath);
        }

        /// <summary>
        /// Create deep zoom image here
        /// </summary>
        /// <returns>The file path of the deep zoom xml file</returns>
        private static string createDeepZoomImage(String imageName, String imagePath, string directoryPath)
        {
            //String[] strings = Regex.Split(imagePath, imageName);
            //String srcFolderPath = strings[0];

            if (!Directory.Exists(directoryPath))
                Directory.CreateDirectory(directoryPath);

            String destFolderPath = Path.GetDirectoryName(directoryPath);

            ImageCreator ic = new ImageCreator();

            ic.TileFormat = ImageFormat.Jpg;
            ic.TileOverlap = 1;
            ic.TileSize = 256;
            ic.ImageQuality = 0.92;
            ic.UseOptimizations = true;

            string directoryName = destFolderPath + "\\" + Path.GetFileNameWithoutExtension(imageName);
            Directory.CreateDirectory(directoryName);

            string target = directoryName + "\\dz.xml";

            ic.Create(imagePath, target);
            ic = null;
            System.GC.Collect();
            System.GC.Collect();
            Thread.Sleep(0);

            return target;
        }

        /*
        public Image downloadImage(string url)
        {
            Image tempImage = null;
            try
            {
                System.Net.HttpWebRequest httpWebRequest = System.Net.HttpWebRequest.Create(url);
                httpWebRequest.AllowWrteStreamBuffering = true;
                
            }
            catch(Exception e)
            {
            }
        }
         */

        public bool ThumbnailCallback() // just using the example; no reason this should be this way
        {
            return false;
        }

        public System.Drawing.Image CreateThumbnailFromImageFile(string imageFilePath)
        {
            System.Drawing.Image original = ImageFromFilePath(imageFilePath);

            System.Drawing.Image.GetThumbnailImageAbort callback 
                = new System.Drawing.Image.GetThumbnailImageAbort(ThumbnailCallback);
            System.Drawing.Image thumbnail 
                = original.GetThumbnailImage(40, 40, callback, IntPtr.Zero);
            return thumbnail;
        }

        public static System.Drawing.Image ImageFromFilePath(string imageFilePath)
        {
            string pathToImage = Path.GetFullPath(imageFilePath);
            System.Drawing.Image toReturn = System.Drawing.Image.FromFile(pathToImage);
            return toReturn;
        }

        public static System.Drawing.Image ResizeAndSaveImage(string imgFilePath, int width, int height, string savePath)
        {
            System.Drawing.Image image = ResizeImage(imgFilePath, width, height);
            SaveImageToPath(image, savePath);
            return image;
        }

        public static System.Drawing.Image ResizeAndSaveImage(System.Drawing.Image image, int width, int height, string savePath)
        {
            System.Drawing.Image newImage = ResizeImage(image, width, height);
            SaveImageToPath(newImage, savePath);
            return newImage;
        }

        public static System.Drawing.Image ResizeImage(string imgFilePath, int width, int height)
        {
            System.Drawing.Image img = ImageFromFilePath(imgFilePath);
            return ResizeImage(img, width, height);
        }

        public static System.Drawing.Image ResizeImage(System.Drawing.Image image, int width, int height)
        {
            return new Bitmap(image, width, height);
        }

        public static void SaveImageToPath(System.Drawing.Image image, string filePath)
        {
            image.Save(Path.GetFullPath(filePath));
        }

        public static System.Windows.Controls.Image ConvertDrawingToControlsImage
            (System.Drawing.Image imageToConvert)
        {
            MemoryStream ms = new MemoryStream();
            imageToConvert.Save(ms, System.Drawing.Imaging.ImageFormat.Bmp);
            ms.Seek(0, SeekOrigin.Begin);

            BitmapImage bitmap = new BitmapImage();
            bitmap.BeginInit();
            bitmap.DecodePixelWidth = imageToConvert.Width;
            bitmap.DecodePixelHeight = imageToConvert.Height;
            bitmap.CacheOption = BitmapCacheOption.OnLoad;
            bitmap.StreamSource = ms;
            bitmap.EndInit();
            bitmap.Freeze();

            System.Windows.Controls.Image toReturn = new System.Windows.Controls.Image();
            toReturn.Source = bitmap;
            return toReturn;
        }
         
    }
}
