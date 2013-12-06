using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;
using ServerAuthoringApp;

namespace guiAuthoring
{
    /// <summary>
    /// Interaction logic for ExhibitionSelector.xaml
    /// </summary>
    public partial class ExhibitionSelector : Window
    {
        private MainWindow _parentWindow;
        public ExhibitionSelector(MainWindow window)
        {
            _parentWindow = window;
            InitializeComponent();
            ExhibitionSelection.ItemsSource = MainWindow.TagCreator.GetExhibitions().Keys;
        }

        private void CancelAddExhibition_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }

        private void AddExhibition_Click(object sender, RoutedEventArgs e)
        {
            System.Collections.IList exhibitions = ExhibitionSelection.SelectedItems;
            if (exhibitions != null && exhibitions.Count > 0)
            {
                _parentWindow.AddExhibitionsToCurrentArtwork(exhibitions);
                this.Close();
                SelectorLabel.Foreground = Brushes.Black;
            }
            else
            {
                SelectorLabel.Foreground = Brushes.Red;
            }
        }
    }
}
