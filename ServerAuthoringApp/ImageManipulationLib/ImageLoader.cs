using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Microsoft.DeepZoomTools;
using System.IO;
using System.Threading;
using System.Drawing;

namespace ImageManipulationLib
{
    public class ImageLoader
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
            // TODO verify the input is an image file
            string pathToImage = Path.GetFullPath(imageFilePath);
            System.Drawing.Image original = System.Drawing.Image.FromFile(pathToImage);

            System.Drawing.Image.GetThumbnailImageAbort callback 
                = new System.Drawing.Image.GetThumbnailImageAbort(ThumbnailCallback);
            System.Drawing.Image thumbnail 
                = original.GetThumbnailImage(40, 40, callback, IntPtr.Zero);
            return thumbnail;
        }
         
    }
}
