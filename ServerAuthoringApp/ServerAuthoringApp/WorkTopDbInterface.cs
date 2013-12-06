using System;
using System.IO;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading;
using WorkTopDB;
using ImageManipulationLib;
using System.Drawing;
using WpfWorkTopServer;
using HumanitiesBubbles;
using System.Windows.Controls;
using System.Collections.Specialized;
using Konamiman.Data;

namespace ServerAuthoringApp
{
    public class TagConstants 
    {
        public const string EXHIBITION_FIELD = "TAG_Exhibition";
        public const string ARTWORK_FIELD = "TAG_Artwork";
    }

    public interface ITagCreator // TODO: Think of a better name
    {
        Dictionary<string, DoqData> GetArtworks();
        Dictionary<string, DoqData> GetExhibitions();
        void ImportArtworks(string[] artworkFilePath);
        DoqData CreateExhibition(string exhibitionName);
        void AddExhibitionsToArtwork(DoqData artwork, System.Collections.IList exhibitionNames);
        bool AddFieldToArtwork(string fieldName, string fieldValue, DoqData artwork);
        Dictionary<string, DoqData> GetArtworkExhibitions(DoqData artwork);
    }

    public class WorkTopDbInterface : ITagCreator // TODO: Think of a better name
    {
        private ImageManipulator _imageManipulator;
        
        private Guid _exhibitionsFolder;

        // connects to the database and initializes the exhibition list
        public WorkTopDbInterface()
        {
            MainWindow dbSelector = new MainWindow();
            dbSelector.Show();

            _imageManipulator = new ImageManipulator();

            DoqData mainExhibitionList = DoqDataManager.FindDoqByName(Properties.Settings.Default.MainExhibitionListName);
            if (mainExhibitionList == null)
            {
                _exhibitionsFolder = CreateFolder(Properties.Settings.Default.MainExhibitionListName, Guid.Empty).Identifier;
            }
            else
            {
                _exhibitionsFolder = mainExhibitionList.Identifier;
            }

        }
       
        [STAThread]
        static void Main(string[] args) {
            new WorkTopDbInterface();
        }

        public void ImportArtworks(string[] imagePaths)
        {
            foreach (string img in imagePaths)
            {
                DoqData doq = ImportImageByName(img);
                doq.AddField(TagConstants.ARTWORK_FIELD);
            }
        }

        public DoqData ImportImageByName(string fileName)
        {
            string name = Path.GetFileNameWithoutExtension(fileName);

            // create deep zoom files
            string pathToXml = ImageManipulator.createDeepZoomImage
                (fileName, ServerAuthoringApp.Properties.Settings.Default.ImageDirectory);

            // create smaller image if necessary
            System.Drawing.Image image = ImageManipulator.ImageFromFilePath(fileName);
            string savePath = Path.GetDirectoryName(pathToXml) + Path.DirectorySeparatorChar + name + Path.GetExtension(fileName);
            if (image.Width > ServerAuthoringApp.Properties.Settings.Default.LowResImageWidth
                && image.Height > ServerAuthoringApp.Properties.Settings.Default.LowResImageHeight)
            {
                ImageManipulationLib.ImageManipulator.ResizeAndSaveImage(image,
                    ServerAuthoringApp.Properties.Settings.Default.LowResImageWidth,
                    ServerAuthoringApp.Properties.Settings.Default.LowResImageHeight,
                    savePath);
            }
            else
            {
                ImageManipulator.SaveImageToPath(image, savePath);
            }
            
            // import new Image Doq
            System.Windows.Controls.Image cntrlImage 
                = ImageManipulator.ConvertDrawingToControlsImage(image);
            Guid guid = DoqDataManager.ImportImage(cntrlImage, name);
            DoqData doq = DoqDataManager.Doq(guid);

            doq.URL = savePath;

            // add deepzoom xml path to to metadata 
            doq.SetMetadata("DeepzoomPath", pathToXml);

            // create thumbnail
            System.Drawing.Image thumbnail = _imageManipulator.CreateThumbnailFromImageFile(fileName);
            string thumbnailPath = Path.GetDirectoryName(pathToXml) 
                + Path.DirectorySeparatorChar + "Thumbnail_" + name + Path.GetExtension(fileName);
            thumbnail.Save(thumbnailPath);
            doq.Icon = thumbnailPath;
            DoqData.SendMetadataChangedEvent(doq);

            return doq;
        }

        public void AddExhibitionsToArtwork(DoqData artwork, System.Collections.IList exhibitionNames)
        {
            Dictionary<string, DoqData> exhibitions = GetExhibitions();
            foreach (string name in exhibitionNames)
            {
                Guid exhibitionGuid = exhibitions[name].Identifier;
                AddFolderToDoqData(artwork, exhibitionGuid);
            }
        }

        public void AddFolderToDoqData(DoqData doq, Guid folderGuid)
        {
            doq.AddFolder(folderGuid);
        }

        /// <summary>
        /// Calls the necessary functions for creating an exhibition.
        /// </summary>
        /// <param name="exhibitionName"></param>
        /// <returns></returns>
        public DoqData CreateExhibition(string exhibitionName)
        {
            DoqData exhibition = CreateFolder(exhibitionName, _exhibitionsFolder);
            exhibition.AddField(TagConstants.EXHIBITION_FIELD);
            return exhibition;
        }

        public LinqData CreateLinq()
        {
            throw new NotImplementedException();
        }

        /// <summary>
        /// Creates a generic folder in the database.
        /// </summary>
        /// <param name="name"></param>
        /// <param name="primaryFolder"></param>
        /// <returns></returns>
        public DoqData CreateFolder(string name, Guid primaryFolder)
        {
            DoqData newFolder = DoqDataManager.Import(Guid.NewGuid(), ".dqg", name, name);
            newFolder.AddFolder(primaryFolder); // not sure if this should be there
            newFolder.PrimaryFolder = primaryFolder;
            DoqData.SendMetadataChangedEvent(newFolder);
            
            return newFolder;
        }

        /// <summary>
        /// A dictionary containing all the name-GUID pairs of Exhibitions in the database.
        /// </summary>
        public Dictionary<string, DoqData> GetExhibitions()
        {
            Dictionary<string, DoqData> exhibitions = new Dictionary<string, DoqData>();
            foreach (DoqData doq in DoqDataManager.Doqs)
            {
                if (doq.Type == DoqData.DoqType.Folder && doq.Metadata.ContainsField(TagConstants.EXHIBITION_FIELD))
                {
                    exhibitions.Add(doq.Name, doq);
                }
            }
            return exhibitions;
        }

        public Dictionary<string, DoqData> GetArtworks()
        {
            Dictionary<string, DoqData> artworks = new Dictionary<string, DoqData>();
            foreach (DoqData doq in DoqDataManager.Doqs)
            {
                if (doq.Type == DoqData.DoqType.Image)
                {
                    artworks.Add(doq.Name, doq);
                }
            }
            return artworks;
        }

        public bool AddFieldToArtwork(string fieldName, string fieldValue, DoqData artwork)
        {
            if (fieldName != null)
            {
                artwork.SetMetadata(fieldName, fieldValue);
                DoqData.SendMetadataChangedEvent(artwork);
                return artwork.Metadata.ContainMatch(fieldName, fieldValue);
            }
            return false;
        }

        public Dictionary<string, DoqData> GetArtworkExhibitions(DoqData artwork)
        {
            Dictionary<string, DoqData> exhibitions = new Dictionary<string, DoqData>();
            foreach (DoqData d in GetFolders(artwork))
            {
                exhibitions.Add(d.Name, d);
            }
            return exhibitions;
        }

        public List<DoqData> GetFolders(DoqData doq)
        {
            List<Guid> folderIds = doq.Folders;
            List<DoqData> doqs = new List<DoqData>();
            foreach (Guid g in folderIds)
            {
                doqs.Add(DoqDataManager.Doq(g));
            }
            return doqs;
        }

    }


}
