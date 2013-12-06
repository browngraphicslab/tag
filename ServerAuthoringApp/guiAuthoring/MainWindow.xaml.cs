using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Navigation;
using System.Windows.Shapes;
using ServerAuthoringApp;
using HumanitiesBubbles;
using WorkTopDB;

namespace guiAuthoring
{
    public delegate void ExhibitionsChangedHandler(object sender, EventArgs e);

    /// <summary>
    /// Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow : Window
    {
        public static ITagCreator TagCreator = new WorkTopDbInterface();

        private bool _isArtwork = true;

        public MainWindow()
        {
            InitializeComponent();
            ChangeExhibitionsVisibility(Visibility.Hidden);
            ChangeArtworkVisibility(Visibility.Visible);
        }

        public event ExhibitionsChangedHandler ExhibitionsChanged;

        protected virtual void OnExhibitionsUpdate(EventArgs e)
        {
        }

        private void Artworks_Click(object sender, RoutedEventArgs e)
        {
            ChangeExhibitionsVisibility(Visibility.Hidden);
            ChangeArtworkVisibility(Visibility.Visible);
        }

        public void ChangeArtworkVisibility(Visibility v)
        {
            if (v == Visibility.Visible)
            {
                nameLabel.Content = "Artworks";
                ArtworkListBox.ItemsSource = TagCreator.GetArtworks().Keys;
                if (CurrentArtwork != null)
                {
                    ArtworkExhibitionList.ItemsSource = TagCreator.GetArtworkExhibitions(CurrentArtwork).Keys;
                }
            }
            else
            {
                ArtworkListBox.ItemsSource = null;
                ArtworkExhibitionList.ItemsSource = null;
            }

            ArtworkExhibitionList.Visibility = v;
            ArtworkExhibitionListLabel.Visibility = v;
            ArtworkMetadataLabel.Visibility = v;
            ArtworkMetadataListBox.Visibility = v;
            ArtworkListBox.Visibility = v;
            exhibition.Visibility = v;
            fieldList.Visibility = v;
            _isArtwork = v == Visibility.Hidden || v == Visibility.Collapsed ? false : true;
        }

        private void Exhibitions_Click(object sender, RoutedEventArgs e)
        {
            ChangeArtworkVisibility(Visibility.Hidden);
            ChangeExhibitionsVisibility(Visibility.Visible);
        }

        public void ChangeExhibitionsVisibility(Visibility v)
        {
            if (v == Visibility.Visible)
            {
                nameLabel.Content = "Exhibitions";
                ExhibitionListBox.ItemsSource = TagCreator.GetExhibitions().Keys;
            }
            else
            {
                ExhibitionListBox.ItemsSource = null;
            }

            ExhibitionListBox.Visibility = v;
            Name.Visibility = v;
            bg.Visibility = v;
            bgImage.Visibility = v;
        }

        private void Add_Exhibitions_Click(object sender, RoutedEventArgs e)
        {
            if (CurrentArtwork == null)
            {
                MessageBox.Show("You must select an artwork to which to add exhibitions.");
                return;
            }
            ExhibitionSelector selector = new ExhibitionSelector(this);
            selector.Show();
            selector.Focus();
        }

        private void Add_Click(object sender, RoutedEventArgs e)
        {
            FieldItem item = new FieldItem();
            fieldList.Items.Add(item);
        }

        private void import_Click(object sender, RoutedEventArgs e)
        {
            if (_isArtwork)
            {
                Microsoft.Win32.OpenFileDialog dialog = new Microsoft.Win32.OpenFileDialog();
                dialog.Title = "Select Image Files to Import";
                dialog.InitialDirectory = @"c:\";
                dialog.Filter = "Image Files(*.BMP;*.JPG;*.GIF)|*.BMP;*.JPG;*.GIF|All files (*.*)|*.*";
                dialog.FilterIndex = 2;
                dialog.RestoreDirectory = true;
                dialog.Multiselect = true;
                dialog.CheckFileExists = true;
                dialog.CheckPathExists = true;

                Nullable<bool> result = dialog.ShowDialog();
                if (result == true)
                {
                    TagCreator.ImportArtworks(dialog.FileNames);
                    // update the list of artworks
                }
            }
            else
            {
                ExhibitionNameEditor nameField = new ExhibitionNameEditor();
                nameField.Show();
            }
        }

        public DoqData CurrentExhibition
        {
            get;
            private set;
        }

        public DoqData CurrentArtwork
        {
            get;
            private set;
        }

        private void ExhibitionListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            string exhibition = (string)((sender as ListBox).SelectedItem);
            CurrentExhibition = TagCreator.GetExhibitions()[exhibition];
        }

        private void ArtworkListBox_SelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            string artwork = (string) ((sender as ListBox).SelectedItem);
            CurrentArtwork = TagCreator.GetArtworks()[artwork];
            DisplayArtworkMetadata();
            DisplayArtworkExhibitions();
        }

        public void DisplayArtworkMetadata()
        {
            ArtworkMetadataListBox.Items.Clear();
            foreach(var m in CurrentArtwork.Metadata) {
                ArtworkMetadataListBox.Items.Add(m);
            }
        }

        public void DisplayArtworkExhibitions()
        {
            ArtworkExhibitionList.Items.Clear();
            foreach (var artwork in TagCreator.GetArtworkExhibitions(CurrentArtwork))
            {
                ArtworkExhibitionList.Items.Add(artwork);
            }
        }
        
        public bool AddExhibitionsToCurrentArtwork(System.Collections.IList exhibitions)
        {
            if (CurrentArtwork != null)
            {
                TagCreator.AddExhibitionsToArtwork(CurrentArtwork, exhibitions);
                return true;
            }
            return false;
        }

        private void SaveFields_Click(object sender, RoutedEventArgs e)
        {
            if (CurrentArtwork != null)
            {
                DoqData artwork = CurrentArtwork;
                foreach (FieldItem field in fieldList.Items)
                {
                    string fieldName = field.Name.Text;
                    string value = field.Value.Text;
                    if (fieldName != null || value != null)
                        TagCreator.AddFieldToArtwork(fieldName, value, artwork);
                }
                fieldList.Items.Clear();
            }
            DisplayArtworkMetadata();
        }
    }
}
