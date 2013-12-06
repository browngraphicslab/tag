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

namespace guiAuthoring
{
    /// <summary>
    /// Interaction logic for exhibitionName.xaml
    /// </summary>
    public partial class ExhibitionNameEditor : Window
    {
        public ExhibitionNameEditor()
        {
            InitializeComponent();
        }

        private void ok_Click(object sender, RoutedEventArgs e)
        {
            if (MainWindow.TagCreator.GetExhibitions().ContainsKey(ExhibitionName.Text))
            {
            }
            MainWindow.TagCreator.CreateExhibition(ExhibitionName.Text);
            this.Close();
        }

        private void cancel_Click(object sender, RoutedEventArgs e)
        {
            this.Close();
        }
    }
}
